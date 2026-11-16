# backend/services/security_scanner.py
# Deep OWASP Security & Vulnerability Scanner for Ghost-QA Sentinel
import asyncio
import httpx
import re
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse

class SecurityScanner:
    def __init__(self):
        self.headers_to_check = {
            "Content-Security-Policy": {
                "severity": "HIGH",
                "description_uz": "Content-Security-Policy (CSP) sarlavhasi yo'q. Sayt XSS va ma'lumotlarni o'g'irlash hujumlariga ochiq qolgan.",
                "description_en": "Missing Content-Security-Policy header. Exposes site to XSS and data exfiltration.",
                "recommended": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
            },
            "X-Frame-Options": {
                "severity": "HIGH",
                "description_uz": "X-Frame-Options sarlavhasi yo'q. Saytni boshqa saytlar ichida <iframe> qilib ochib, Clickjacking hujumi qilish mumkin.",
                "description_en": "Missing X-Frame-Options header. Vulnerable to Clickjacking via <iframe> embedding.",
                "recommended": "DENY"
            },
            "X-Content-Type-Options": {
                "severity": "MEDIUM",
                "description_uz": "X-Content-Type-Options yo'q. Brauzerlar fayllar turini o'zgartirib o'qishi (MIME-sniffing) xavfi mavjud.",
                "description_en": "Missing X-Content-Type-Options header. Vulnerable to MIME sniffing attacks.",
                "recommended": "nosniff"
            },
            "Strict-Transport-Security": {
                "severity": "HIGH",
                "description_uz": "HSTS sarlavhasi yo'q. Foydalanuvchilarni shifrlanmagan HTTP ga majburiy tushirish (SSL Stripping) xavfi bor.",
                "description_en": "Missing HSTS header. Vulnerable to SSL Stripping / downgrade attacks.",
                "recommended": "max-age=31536000; includeSubDomains; preload"
            },
            "Referrer-Policy": {
                "severity": "LOW",
                "description_uz": "Referrer-Policy belgilanmagan. Havolalar orqali ichki URL parametrlari uchinchi tomonlarga sizib chiqishi mumkin.",
                "description_en": "Missing Referrer-Policy header. Sensitive URL query params may leak in HTTP Referer.",
                "recommended": "strict-origin-when-cross-origin"
            },
            "Permissions-Policy": {
                "severity": "LOW",
                "description_uz": "Permissions-Policy yo'q. Brauzer mikrofoni, kamerasi va geolokatsiyasiga cheklov o'rnatilmagan.",
                "description_en": "Missing Permissions-Policy. Browser hardware (mic, camera, geo) is unrestricted.",
                "recommended": "camera=(), microphone=(), geolocation=()"
            }
        }

        self.sensitive_paths = [
            {"path": "/.env", "name": "Environment Variables (.env)", "severity": "CRITICAL"},
            {"path": "/.git/HEAD", "name": "Git Repository Metadata", "severity": "CRITICAL"},
            {"path": "/package.json", "name": "Node.js Dependencies Manifest", "severity": "LOW"},
            {"path": "/docker-compose.yml", "name": "Docker Configuration", "severity": "HIGH"},
            {"path": "/.DS_Store", "name": "macOS System Metadata", "severity": "LOW"}
        ]

    async def scan_target(self, target_url: str) -> Dict[str, Any]:
        """
        Executes an asynchronous multi-vector cybersecurity audit against target URL.
        """
        parsed = urlparse(target_url)
        if not parsed.scheme or parsed.scheme not in ["http", "https"]:
            return {
                "error": "Invalid URL scheme. Only HTTP and HTTPS are permitted.",
                "score": 0,
                "grade": "F"
            }

        domain = parsed.netloc
        base_url = f"{parsed.scheme}://{parsed.netloc}"

        vulnerabilities = []
        passed_checks = []
        score = 100

        # Step 1: Check Main URL Headers
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, verify=False) as client:
            try:
                resp = await client.get(target_url)
                headers = {k.lower(): v for k, v in resp.headers.items()}
                
                # Check HTTPS
                if parsed.scheme == "https":
                    passed_checks.append({
                        "id": "SEC-HTTPS",
                        "title": "SSL/TLS Shifrlash",
                        "status": "PASS",
                        "description": "Sayt xavfsiz HTTPS protokoli orqali ishlamoqda."
                    })
                else:
                    score -= 25
                    vulnerabilities.append({
                        "id": "SEC-NO-HTTPS",
                        "severity": "CRITICAL",
                        "title": "Shifrlanmagan HTTP Protokol",
                        "description_uz": "Sayt shifrlanmagan HTTP orqali ishlamoqda. Ma'lumotlar ochiq o'g'irlanishi mumkin.",
                        "description_en": "Target is served over plaintext HTTP. Traffic can be intercepted.",
                        "fix": "HTTPS va SSL sertifikatini yoqing (Let's Encrypt / Cloudflare)."
                    })

                # Check OWASP Headers
                for header_name, meta in self.headers_to_check.items():
                    val = headers.get(header_name.lower())
                    if val:
                        passed_checks.append({
                            "id": f"SEC-HDR-{header_name}",
                            "title": header_name,
                            "status": "PASS",
                            "value": val[:60],
                            "description": f"{header_name} sarlavhasi to'g'ri sozlangan."
                        })
                    else:
                        penalty = 12 if meta["severity"] == "HIGH" else 6
                        score -= penalty
                        vulnerabilities.append({
                            "id": f"VULN-{header_name.upper().replace('-', '_')}",
                            "severity": meta["severity"],
                            "title": f"Missing {header_name}",
                            "description_uz": meta["description_uz"],
                            "description_en": meta["description_en"],
                            "recommended": meta["recommended"],
                            "fix": f"Sarlavhani serverga qo'shing: {header_name}: {meta['recommended']}"
                        })

                # Check Server & Tech Disclosure
                server_hdr = headers.get("server")
                x_powered_by = headers.get("x-powered-by")
                if x_powered_by:
                    score -= 5
                    vulnerabilities.append({
                        "id": "VULN-TECH-DISCLOSURE",
                        "severity": "MEDIUM",
                        "title": "Texnologiya Ma'lumotlari Sizib Chiqishi (X-Powered-By)",
                        "description_uz": f"Server '{x_powered_by}' texnologiyasini ochiq ko'rsatmoqda. Bu xakerlarga mo'ljal olishni osonlashtiradi.",
                        "description_en": f"Server discloses '{x_powered_by}' in X-Powered-By header.",
                        "fix": "X-Powered-By sarlavhasini o'chirib qo'ying."
                    })

                # Check CORS
                cors_origin = headers.get("access-control-allow-origin")
                cors_creds = headers.get("access-control-allow-credentials")
                if cors_origin == "*" and cors_creds == "true":
                    score -= 15
                    vulnerabilities.append({
                        "id": "VULN-CORS-WILDCARD-CREDS",
                        "severity": "HIGH",
                        "title": "Xavfli CORS Sozlamasi",
                        "description_uz": "Access-Control-Allow-Origin: * bilan Allow-Credentials: true birga ishlatilgan. Autentifikatsiya ma'lumotlari o'g'irlanishi mumkin.",
                        "description_en": "Wildcard CORS origin paired with credentials enabled.",
                        "fix": "Wildcard (*) o'rniga aniq ishonchli domenlarni kiriting."
                    })

            except Exception as e:
                return {
                    "target_url": target_url,
                    "error": f"Nishonga ulanishda xatolik yuz berdi: {str(e)}",
                    "score": 0,
                    "grade": "F",
                    "vulnerabilities": [],
                    "passed_checks": []
                }

        # Step 2: Probe Sensitive Paths (Fast concurrent probing)
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=False, verify=False) as probe_client:
            probe_tasks = [probe_client.get(f"{base_url}{item['path']}") for item in self.sensitive_paths]
            results = await asyncio.gather(*probe_tasks, return_exceptions=True)

            for item, res in zip(self.sensitive_paths, results):
                if isinstance(res, httpx.Response) and res.status_code == 200:
                    body_preview = res.text[:80]
                    # Check if actually leaked or just custom 200 HTML page
                    if "<html" not in body_preview.lower() and "<!doctype" not in body_preview.lower():
                        score -= 20
                        vulnerabilities.append({
                            "id": f"VULN-EXPOSED-{item['path'].replace('/', '_')}",
                            "severity": item["severity"],
                            "title": f"Maxfiy Fayl Ochiq Qolgan: {item['name']}",
                            "description_uz": f"Fayl '{item['path']}' internetga ochiq holda turibdi! Muhim kalitlar yoki ma'lumotlar fosh bo'lgan.",
                            "description_en": f"Sensitive file '{item['path']}' is publicly accessible over HTTP.",
                            "fix": f"Web server sozlamalarida '{item['path']}' yo'lini zudlik bilan bloklang (HTTP 403 / 404)."
                        })

        # Calculate Final Grade
        score = max(0, min(100, score))
        if score >= 90:
            grade = "A+"
        elif score >= 80:
            grade = "A"
        elif score >= 70:
            grade = "B"
        elif score >= 55:
            grade = "C"
        else:
            grade = "F (Zaif)"

        # Hardened Config Templates
        hardened_vercel_json = {
            "headers": [
                {
                    "source": "/(.*)",
                    "headers": [
                        {"key": "X-Frame-Options", "value": "DENY"},
                        {"key": "X-Content-Type-Options", "value": "nosniff"},
                        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
                        {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"},
                        {"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload"},
                        {"key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"}
                    ]
                }
            ]
        }

        return {
            "target_url": target_url,
            "domain": domain,
            "score": score,
            "grade": grade,
            "vulnerabilities": vulnerabilities,
            "passed_checks": passed_checks,
            "hardened_configs": {
                "vercel_json": hardened_vercel_json,
                "nginx_conf": (
                    "add_header X-Frame-Options \"DENY\" always;\n"
                    "add_header X-Content-Type-Options \"nosniff\" always;\n"
                    "add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;\n"
                    "add_header Permissions-Policy \"camera=(), microphone=(), geolocation=()\" always;\n"
                    "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;\n"
                    "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline';\" always;"
                )
            }
        }
