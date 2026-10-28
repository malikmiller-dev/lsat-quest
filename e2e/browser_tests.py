"""Production-build browser regression tests. Run after npm run build."""
import os
import json
import re
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
        self.page.get_by_role("link", name="Start the first quest", exact=True).click()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Necessary & sufficient conditions")
        self.page.reload()
        expect(self.page.get_by_role("heading", level=1)).to_have_text("Necessary & sufficient conditions")
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
        expect(self.page.get_by_role("link", name="Start the first quest", exact=True)).to_be_focused()
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
            for route in ["overview", "path", "quest", "history", "roadmap", "settings"]:
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
        expect(self.page.get_by_text("Not available yet", exact=True)).to_have_count(3)
        self.assertEqual(self.page.locator("main button").count(), 0, "Planned lessons should not appear playable")

    def test_quest_completion_reload_download_and_restore(self):
        questions = json.loads((ROOT / "src/content/conditional-v1.json").read_text(encoding="utf-8"))
        self.page.goto(BASE + "#/quest")
        self.page.get_by_role("button", name="Start provisional exercises").click()
        self.page.get_by_role("radio").nth(1).check()
        self.page.get_by_label("Your reasoning", exact=False).fill("I reversed the rule.")
        self.page.get_by_role("button", name="Submit answer").click()
        expect(self.page.get_by_role("heading", name="Not quite. Answer A is supported.")).to_be_visible()
        self.page.get_by_role("button", name="Try again").click()
        for index, question in enumerate(questions):
            self.page.get_by_role("radio", name=re.compile(r"^" + question["answer"] + r"\.")).check()
            self.page.get_by_role("button", name="Submit answer").click()
            expect(self.page.get_by_role("heading", name=f'Correct. Answer {question["answer"]} is supported.')).to_be_visible()
            if index < len(questions) - 1:
                self.page.get_by_role("button", name="Next exercise").click()
        self.page.get_by_role("button", name="Complete quest").click()
        expect(self.page.get_by_role("heading", name="Quest complete.")).to_be_visible()
        self.page.reload()
        expect(self.page.get_by_text("6/6 solved · 80 XP earned", exact=True)).to_be_visible()
        self.page.goto(BASE + "#/history")
        expect(self.page.get_by_text("7 saved attempts. Most recent first.")).to_be_visible()
        expect(self.page.get_by_text("I reversed the rule.", exact=True)).to_be_visible()
        self.page.goto(BASE + "#/settings")
        with self.page.expect_download() as download_info:
            self.page.get_by_role("button", name="Export study backup").click()
        backup = ROOT / "test-results/study-backup.json"
        download_info.value.save_as(str(backup))
        fresh = self.browser.new_context()
        self.addCleanup(fresh.close)
        restored = fresh.new_page()
        restored.on("pageerror", lambda error: self.errors.append(str(error)))
        restored.goto(BASE + "#/settings")
        for _ in range(2):
            restored.get_by_label("Choose a backup to restore").set_input_files(str(backup))
            restored.get_by_role("button", name="Merge backup").click()
            expect(restored.get_by_role("status")).to_contain_text("7 total attempts saved")
        restored.goto(BASE + "#/quest")
        expect(restored.get_by_text("6/6 solved · 80 XP earned", exact=True)).to_be_visible()
        for width in [390, 1440]:
            restored.set_viewport_size({"width": width, "height": 1000})
            self.assertTrue(restored.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
            restored.screenshot(path=str(ROOT / f"test-results/quest-{width}.png"), full_page=True)

    def test_invalid_restore_preserves_history(self):
        self.page.goto(BASE + "#/quest")
        self.page.get_by_role("button", name="Start provisional exercises").click()
        self.page.get_by_role("radio").first.check()
        self.page.get_by_role("button", name="Submit answer").click()
        expect(self.page.get_by_role("heading", name="Correct. Answer A is supported.")).to_be_visible()
        self.page.goto(BASE + "#/settings")
        self.page.get_by_label("Choose a backup to restore").set_input_files({"name": "bad.json", "mimeType": "application/json", "buffer": b'{"schemaVersion": 99}'})
        expect(self.page.get_by_role("alert")).to_contain_text("Unsupported format or schema")
        expect(self.page.get_by_role("button", name="Merge backup")).to_have_count(0)
        self.page.goto(BASE + "#/history")
        expect(self.page.get_by_text("1 saved attempt. Most recent first.")).to_be_visible()

    def test_missing_indexeddb_has_recoverable_error(self):
        self.context.add_init_script("Object.defineProperty(window, 'indexedDB', {get() {throw new Error('Storage denied');}})")
        self.page.goto(BASE + "#/quest")
        expect(self.page.get_by_role("alert")).to_contain_text("Study storage is unavailable")
        expect(self.page.get_by_role("button", name="Retry storage")).to_be_visible()
        expect(self.page.get_by_role("button", name="Start provisional exercises")).to_have_count(0)
        self.page.get_by_role("checkbox", name="Gold border (A)").check()
        expect(self.page.get_by_text("Violates the rule:", exact=False)).to_be_visible()


if __name__ == "__main__":
    unittest.main(verbosity=2)
