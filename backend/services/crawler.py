import asyncio
import os
import uuid
import base64
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Callable, Optional
from playwright.async_api import async_playwright, Page, Response, Error as PlaywrightError
from ..config import settings

class CrawlerIncident:
    def __init__(
        self,
        bug_type: str,
        message: str,
        url: str,
        severity: str = "HIGH",
        stack_trace: Optional[str] = None,
        selector: Optional[str] = None,
        dom_context: Optional[str] = None,
        screenshot_path: Optional[str] = None,
        screenshot_base64: Optional[str] = None,
    ):
        self.id = str(uuid.uuid4())
        self.bug_type = bug_type
        self.severity = severity
        self.message = message
        self.stack_trace = stack_trace
        self.url = url
        self.selector = selector
        self.dom_context = dom_context
        self.screenshot_path = screenshot_path
        self.screenshot_base64 = screenshot_base64
        self.created_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bug_type": self.bug_type,
            "severity": self.severity,
            "message": self.message,
            "stack_trace": self.stack_trace,
            "url": self.url,
            "selector": self.selector,
            "dom_context": self.dom_context,
            "screenshot_path": self.screenshot_path,
            "screenshot_base64": self.screenshot_base64,
            "created_at": self.created_at.isoformat(),
        }

class GhostCrawler:
    def __init__(self, log_callback: Optional[Callable[[str, str], Any]] = None):
        self.log_callback = log_callback
        self.incidents: List[CrawlerIncident] = []

    async def log(self, level: str, message: str):
        if self.log_callback:
            try:
                if asyncio.iscoroutinefunction(self.log_callback):
                    await self.log_callback(level, message)
                else:
                    self.log_callback(level, message)
            except Exception as e:
                pass
        try:
            print(f"[{level}] {message}")
        except Exception:
            safe_msg = message.encode("ascii", errors="replace").decode("ascii")
            print(f"[{level}] {safe_msg}")

    async def run_scan(self, url: str, scan_id: str, max_interactions: int = 15) -> List[CrawlerIncident]:
        self.incidents = []

        # Security Hardening: SSRF & Protocol Whitelist Guard
        if not (url.startswith("http://") or url.startswith("https://")):
            await self.log("ERROR", f"❌ Security Violation: Target URL scheme '{url}' is forbidden. Only HTTP/HTTPS allowed.")
            return []

        await self.log("INFO", f"🕷️ Ghost-QA Autonomous Agent launching headless Chromium for: {url}")

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
            )
            context = await browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent="GhostQA-Sentinel-AutonomousAgent/1.0"
            )
            page = await context.new_page()

            # Automatically dismiss any alert/confirm/prompt dialogs to prevent execution blocking
            page.on("dialog", lambda dialog: asyncio.create_task(dialog.dismiss()))

            # Tracking errors during interaction
            current_interaction_errors: List[Dict[str, Any]] = []

            # Listeners
            def handle_console(msg):
                if msg.type == "error":
                    text = msg.text
                    # Avoid duplicated noise
                    current_interaction_errors.append({
                        "type": "CONSOLE_ERROR",
                        "message": text,
                        "location": msg.location
                    })

            def handle_page_error(exc):
                current_interaction_errors.append({
                    "type": "PAGE_ERROR",
                    "message": str(exc),
                    "stack": getattr(exc, "stack", "")
                })

            def handle_response(resp: Response):
                if resp.status >= 400:
                    current_interaction_errors.append({
                        "type": "NETWORK_FAIL",
                        "message": f"Network request to {resp.url} failed with HTTP {resp.status} ({resp.status_text})",
                        "status": resp.status,
                        "url": resp.url
                    })

            def handle_request_failed(req):
                current_interaction_errors.append({
                    "type": "NETWORK_FAIL",
                    "message": f"Network request to {req.url} aborted or failed: {req.failure}",
                    "url": req.url
                })

            page.on("console", handle_console)
            page.on("pageerror", handle_page_error)
            page.on("response", handle_response)
            page.on("requestfailed", handle_request_failed)

            # Step 1: Navigate
            await self.log("INFO", f"🌐 Navigating to {url} and waiting for DOM ready...")
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(1.0)
                await self.log("SUCCESS", f"✅ Initial page load complete for {url}")
            except Exception as e:
                await self.log("ERROR", f"❌ Failed to reach target URL: {str(e)}")
                incident = CrawlerIncident(
                    bug_type="PAGE_LOAD_FAILURE",
                    message=f"Failed to navigate to {url}: {str(e)}",
                    url=url,
                    severity="CRITICAL"
                )
                self.incidents.append(incident)
                await browser.close()
                return self.incidents

            # Check for initial page errors
            if current_interaction_errors:
                for err in list(current_interaction_errors):
                    inc = await self._capture_incident(
                        page=page,
                        scan_id=scan_id,
                        bug_type=err.get("type", "CONSOLE_ERROR"),
                        message=err.get("message", "Initial load error"),
                        stack_trace=err.get("stack", ""),
                        selector="window.onload"
                    )
                    self.incidents.append(inc)
                current_interaction_errors.clear()

            # Step 2: Chaos & Monkey Testing
            await self.log("INFO", "🐒 Initiating Chaos Monkey interactive DOM inspection...")
            
            # Find interactive targets
            selectors = [
                "button",
                "a[href]",
                "input[type='submit']",
                "input[type='button']",
                "[role='button']",
                ".btn"
            ]
            elements = await page.query_selector_all(", ".join(selectors))
            await self.log("INFO", f"🎯 Detected {len(elements)} interactive candidate elements.")

            tested_count = 0
            for i, element in enumerate(elements):
                if tested_count >= max_interactions:
                    break

                try:
                    is_visible = await element.is_visible()
                    if not is_visible:
                        continue

                    # Extract details
                    tag_name = await element.evaluate("el => el.tagName.toLowerCase()")
                    el_id = await element.evaluate("el => el.id || ''")
                    el_text = (await element.inner_text()).strip()[:40]
                    el_selector = f"{tag_name}" + (f"#{el_id}" if el_id else f":has-text('{el_text}')" if el_text else f":nth-match({i})")

                    await self.log("INFO", f"🧪 Testing interactive element [{i+1}/{len(elements)}]: `{el_selector}`")

                    # Check for overlay intercept / z-index blockage before clicking
                    bounding_box = await element.bounding_box()
                    if bounding_box:
                        center_x = bounding_box["x"] + bounding_box["width"] / 2
                        center_y = bounding_box["y"] + bounding_box["height"] / 2

                        element_at_point = await page.evaluate("""([x, y]) => {
                            const topEl = document.elementFromPoint(x, y);
                            if (!topEl) return null;
                            return {
                                id: topEl.id || '',
                                tagName: topEl.tagName.toLowerCase(),
                                className: topEl.className || ''
                            };
                        }""", [center_x, center_y])

                        if element_at_point:
                            top_id = element_at_point.get("id")
                            if top_id and top_id != el_id and ("overlay" in top_id.lower() or "modal" in top_id.lower() or "blocker" in top_id.lower()):
                                # Invisible/Blocker overlay found!
                                await self.log("WARN", f"⚠️ Layout Block Detected: Element `{el_selector}` is obstructed by `#{top_id}`")
                                inc = await self._capture_incident(
                                    page=page,
                                    scan_id=scan_id,
                                    bug_type="LAYOUT_BLOCK",
                                    message=f"Element `{el_selector}` is non-interactive: obstructed by z-index overlay `#{top_id}`",
                                    severity="HIGH",
                                    selector=f"#{top_id}",
                                    element=element
                                )
                                self.incidents.append(inc)

                    # Clear errors before click
                    current_interaction_errors.clear()

                    # Trigger interaction
                    try:
                        await element.click(timeout=3000)
                    except PlaywrightError as pe:
                        err_str = str(pe)
                        if "intercepts pointer events" in err_str or "subtree intercepts pointer events" in err_str:
                            await self.log("WARN", f"⚠️ Pointer Intercept Error on `{el_selector}`: {err_str[:120]}")
                            inc = await self._capture_incident(
                                page=page,
                                scan_id=scan_id,
                                bug_type="LAYOUT_BLOCK",
                                message=f"Pointer events intercepted on {el_selector}: {err_str[:200]}",
                                severity="HIGH",
                                selector=el_selector,
                                element=element
                            )
                            self.incidents.append(inc)
                        elif "timeout" in err_str.lower():
                            pass

                    # Wait briefly for async side-effects
                    await asyncio.sleep(0.8)

                    # Inspect errors gathered from click
                    if current_interaction_errors:
                        for err in list(current_interaction_errors):
                            severity = "CRITICAL" if "TypeError" in err.get("message", "") or "ReferenceError" in err.get("message", "") else "HIGH"
                            await self.log("ERROR", f"💥 Bug Triggered by `{el_selector}`: {err.get('message')}")
                            
                            inc = await self._capture_incident(
                                page=page,
                                scan_id=scan_id,
                                bug_type=err.get("type", "CONSOLE_ERROR"),
                                message=err.get("message", "Execution error"),
                                severity=severity,
                                stack_trace=err.get("stack", ""),
                                selector=el_selector,
                                element=element
                            )
                            self.incidents.append(inc)
                        current_interaction_errors.clear()

                    tested_count += 1

                except Exception as ex:
                    # Non-fatal monkey testing skip
                    continue

            await self.log("INFO", f"🏁 Chaos testing complete. Discovered {len(self.incidents)} distinct defect incidents.")
            await browser.close()
            return self.incidents

    async def _capture_incident(
        self,
        page: Page,
        scan_id: str,
        bug_type: str,
        message: str,
        severity: str = "HIGH",
        stack_trace: Optional[str] = None,
        selector: Optional[str] = None,
        element = None
    ) -> CrawlerIncident:
        # Save screenshot
        inc_id = str(uuid.uuid4())
        filename = f"{scan_id}_{inc_id}.png"
        file_path = settings.SCREENSHOTS_DIR / filename

        screenshot_base64 = None
        try:
            screenshot_bytes = await page.screenshot(full_page=False)
            with open(file_path, "wb") as f:
                f.write(screenshot_bytes)
            screenshot_base64 = base64.b64encode(screenshot_bytes).decode("utf-8")
        except Exception as e:
            file_path = None

        # Extract DOM context
        dom_context = ""
        try:
            if element:
                dom_context = await element.evaluate("""el => {
                    const parent = el.parentElement ? el.parentElement.outerHTML.substring(0, 500) : '';
                    return el.outerHTML + '\\n<!-- Parent Context -->\\n' + parent;
                }""")
            else:
                dom_context = await page.evaluate("() => document.body.innerHTML.substring(0, 1000)")
        except Exception:
            dom_context = "Could not capture DOM context."

        incident = CrawlerIncident(
            bug_type=bug_type,
            message=message,
            url=page.url,
            severity=severity,
            stack_trace=stack_trace,
            selector=selector,
            dom_context=dom_context,
            screenshot_path=str(file_path) if file_path else None,
            screenshot_base64=screenshot_base64
        )
        incident.id = inc_id
        return incident
