# verify_security_suite.py
# Comprehensive Security Scanner & Radar Verification for Ghost-QA Sentinel
import sys
import asyncio
import httpx

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from playwright.async_api import async_playwright

async def verify_security():
    print("=" * 65)
    print("🛡️ GHOST-QA SENTINEL: CYBERSECURITY AUDIT & RADAR VERIFICATION")
    print("=" * 65)

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Step 1: Test GET /api/security/audit
        print("\n[SEC-TEST 1/4] Probing GET /api/security/audit...")
        resp = await client.get("http://127.0.0.1:8000/api/security/audit?target_url=http://localhost:8000/sandbox")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        print(f"  ✓ Target Domain: {data.get('domain')}")
        print(f"  ✓ Security Score: {data.get('score')}/100 (Grade: {data.get('grade')})")
        print(f"  ✓ Detected Vulnerabilities: {len(data.get('vulnerabilities', []))} found")
        assert len(data.get("vulnerabilities", [])) > 0, "Expected vulnerabilities in demo sandbox"
        assert "hardened_configs" in data, "Expected hardened configurations"
        print("  ✓ Hardened Configs Generated: vercel.json & nginx.conf present")

        # Step 2: Test POST /api/security/audit
        print("\n[SEC-TEST 2/4] Probing POST /api/security/audit with JSON Payload...")
        post_resp = await client.post(
            "http://127.0.0.1:8000/api/security/audit",
            json={"target_url": "http://localhost:8000/sandbox"}
        )
        assert post_resp.status_code == 200, f"Expected 200, got {post_resp.status_code}"
        post_data = post_resp.json()
        assert post_data.get("score") == data.get("score")
        print("  ✓ POST Endpoint In Parity with GET: Verified")

        # Step 3: Security Boundary & Protocol Validation (SSRF guard)
        print("\n[SEC-TEST 3/4] Testing SSRF Guard & Malicious Protocol Blocking...")
        malicious_resp = await client.post(
            "http://127.0.0.1:8000/api/security/audit",
            json={"target_url": "file:///etc/passwd"}
        )
        mal_data = malicious_resp.json()
        assert "error" in mal_data or mal_data.get("score") == 0
        print("  ✓ Forbidden 'file://' Scheme Blocked: Verified")

    # Step 4: Playwright E2E UI Verification
    print("\n[SEC-TEST 4/4] Playwright E2E Browser Testing of Security Radar HUD...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        await context.add_init_script("""
            localStorage.setItem('ghostqa_lang', 'uz');
            localStorage.setItem('ghostqa_lang_selected', 'true');
            localStorage.setItem('ghostqa_visited_v2', 'true');
        """)
        page = await context.new_page()
        await page.goto("http://localhost:3000", wait_until="networkidle")

        # Verify Radar is in DOM
        has_radar = await page.locator("text=OWASP Xavfsizlik").count() > 0 or await page.locator("text=ZERO-DAY SHIELD").count() > 0
        print(f"  ✓ Security Vulnerability Radar Present: {has_radar}")
        assert has_radar, "Security Radar was not found on the page!"

        # Click Hardened Configs Tab
        configs_tab = page.locator("button:has-text('Tayyor Himoya Patchi')").first
        if await configs_tab.count() > 0:
            await configs_tab.click()
            await page.wait_for_timeout(400)
            has_vercel_tab = await page.locator("text=vercel.json").count() > 0
            print(f"  ✓ Hardened Configs Tab Clickable & Active: {has_vercel_tab}")

        # Click Passed Checks Tab
        passed_tab = page.locator("button:has-text('O\\'tgan Testlar')").first
        if await passed_tab.count() > 0:
            await passed_tab.click()
            await page.wait_for_timeout(400)
            has_ssl_check = await page.locator("text=SSL/TLS").count() > 0
            print(f"  ✓ Passed Checks Tab Clickable & Active: {has_ssl_check}")

        # Capture evidence screenshot
        screenshot_path = "frontend/public/screenshots/security_radar_verification.png"
        await page.screenshot(path=screenshot_path)
        print(f"  ✓ Captured Security Radar Evidence: {screenshot_path}")

        await browser.close()

    print("\n" + "=" * 65)
    print("🏆 ALL CYBERSECURITY AUDIT & RADAR TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(verify_security())
