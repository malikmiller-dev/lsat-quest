"""Production-build browser regression tests. Run after npm run build."""
import os
import faulthandler
from pathlib import Path
import shutil
import subprocess
import time
import unittest
import urllib.request

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
BASE = "http://127.0.0.1:4173/lsat-quest/"


class BrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        (ROOT / "test-results").mkdir(exist_ok=True)
        cls.start_server()
        faulthandler.dump_traceback_later(30, exit=True)
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        launch = {"headless": True}
        if os.environ.get("LSAT_BROWSER_PATH"):
            launch["executable_path"] = os.environ["LSAT_BROWSER_PATH"]
        cls.browser = cls.playwright.chromium.launch(**launch)
        faulthandler.cancel_dump_traceback_later()
        cls.addClassCleanup(cls.browser.close)

    @classmethod
    def start_server(cls):
        cls.server_log = (ROOT / "test-results" / "preview.log").open("w")
        cls.server = subprocess.Popen(
            [shutil.which("node"), str(ROOT / "node_modules/vite/bin/vite.js"),
             "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
            cwd=ROOT, stdout=cls.server_log, stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        cls.addClassCleanup(cls.server_log.close)
        cls.addClassCleanup(cls.stop_server)
        for _ in range(100):
            if cls.server.poll() is not None:
                raise RuntimeError("Preview exited. See test-results/preview.log")
            try:
                with urllib.request.urlopen(BASE, timeout=1) as response:
                    if response.status == 200:
                        break
            except (OSError, TimeoutError):
                time.sleep(0.1)
        else:
            raise RuntimeError("Production preview did not become ready")

    @classmethod
    def stop_server(cls):
        if cls.server.poll() is None:
            cls.server.terminate()
            cls.server.wait(timeout=10)

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1100})
        self.addCleanup(self.context.close)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.assertEqual(self.errors, [], "Browser runtime errors")

    def test_navigation_reload_and_unknown_route(self):
        self.page.goto(BASE)
        expect(self.page.get_by_role("heading", level=1)).to_contain_text("Great reasoning")
        self.page.get_by_role("link", name="Explore the learning path").click()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Start with the foundations.")
        self.page.reload()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Start with the foundations.")
        self.page.goto(BASE + "#/roadmap")
        expect(self.page.locator(".roadmap-item")).to_have_count(16)
        self.page.goto(BASE + "#/not-a-page")
        expect(self.page.get_by_role("heading", level=1)).to_have_text("That page isn’t here.")
        self.page.get_by_role("link", name="Back to overview").click()
        expect(self.page.get_by_role("heading", level=1)).to_contain_text("Great reasoning")

    def test_theme_persists_through_reload_and_reopen(self):
        self.page.goto(BASE + "#/settings")
        self.page.get_by_role("button", name="Light", exact=True).click()
        expect(self.page.locator("html")).to_have_attribute("data-theme", "light")
        self.page.reload()
        expect(self.page.get_by_role("button", name="Light", exact=True)).to_have_attribute("aria-pressed", "true")
        self.page.close()
        self.page = self.context.new_page()
        self.page.goto(BASE)
        expect(self.page.locator("html")).to_have_attribute("data-theme", "light")
        self.page.screenshot(path=str(ROOT / "test-results/light-desktop.png"), full_page=True)
        self.page.get_by_role("button", name="Switch to dark mode").click()
        self.page.reload()
        expect(self.page.locator("html")).to_have_attribute("data-theme", "dark")

    def test_storage_denial_keeps_navigation_and_appearance_usable(self):
        self.context.add_init_script("Object.defineProperty(window, 'localStorage', {get() {throw new Error('Storage denied');}})")
        self.page.goto(BASE + "#/settings")
        expect(self.page.get_by_role("status")).to_contain_text("browser storage is unavailable")
        self.page.get_by_role("button", name="Light", exact=True).click()
        expect(self.page.locator("html")).to_have_attribute("data-theme", "light")
        self.page.get_by_role("navigation").get_by_role("link", name="Learning path").click()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Start with the foundations.")

    def test_keyboard_navigation_and_skip_link(self):
        self.page.goto(BASE)
        self.page.keyboard.press("Tab")
        expect(self.page.get_by_role("link", name="Skip to content")).to_be_focused()
        self.page.keyboard.press("Enter")
        expect(self.page.get_by_role("main")).to_be_focused()
        self.page.keyboard.press("Tab")
        expect(self.page.get_by_role("link", name="Explore the learning path")).to_be_focused()
        self.page.keyboard.press("Enter")
        expect(self.page.get_by_role("main")).to_be_focused()

    def test_mobile_menu_escape_and_navigation(self):
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.page.goto(BASE)
        expect(self.page.get_by_role("navigation")).not_to_be_visible()
        self.page.get_by_role("button", name="Open navigation").click()
        expect(self.page.get_by_role("navigation")).to_be_visible()
        self.page.keyboard.press("Escape")
        expect(self.page.get_by_role("button", name="Open navigation")).to_be_focused()
        expect(self.page.get_by_role("navigation")).not_to_be_visible()
        self.page.get_by_role("button", name="Open navigation").click()
        self.page.get_by_role("navigation").get_by_role("link", name="Settings").click()
        expect(self.page.get_by_role("navigation")).not_to_be_visible()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Your space. Your preference.")

    def test_responsive_layout_all_routes(self):
        for width in [320, 390, 768, 1024, 1440]:
            self.page.set_viewport_size({"width": width, "height": 1000})
            for route in ["overview", "path", "roadmap", "settings"]:
                with self.subTest(width=width, route=route):
                    self.page.goto(BASE + "#/" + route)
                    expect(self.page.get_by_role("heading", level=1)).to_be_visible()
                    self.assertTrue(self.page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "Horizontal overflow")
            if width in [390, 1440]:
                self.page.goto(BASE)
                self.page.screenshot(path=str(ROOT / f"test-results/dark-{width}.png"), full_page=True)

    def test_production_assets_and_available_controls(self):
        failed = []
        self.page.on("response", lambda response: failed.append(response.url) if response.status >= 400 else None)
        self.page.goto(BASE, wait_until="networkidle")
        self.assertEqual(failed, [])
        self.assertTrue(self.page.locator("link[rel=stylesheet]").get_attribute("href").startswith("/lsat-quest/"))
        self.assertEqual(self.page.locator("button[disabled]").count(), 0)
        self.page.goto(BASE + "#/path")
        expect(self.page.get_by_text("Not available yet", exact=True)).to_have_count(4)
        self.assertEqual(self.page.locator("main button").count(), 0, "Planned lessons should not appear playable")


if __name__ == "__main__":
    unittest.main(verbosity=2)
