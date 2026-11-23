"""Motion lifecycle and fallback checks against npm run preview."""
import argparse
from playwright.sync_api import expect, sync_playwright

def check_gallery(browser, base):
    context = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base)
    active_scene = "window.ScrollTrigger?.getById('showroom-depth')"
    page.wait_for_function(active_scene)
    page.locator('[data-step="1"]').click()
    expect(page.locator("#selected-title")).to_have_text("Business Automation")
    page.wait_for_function("Math.abs(Number(document.querySelector('[data-selected]').style.getPropertyValue('--offset'))) < .001")
    page.locator(".studio-disclosure").first.evaluate("d => d.open = true")
    page.evaluate("window.scrollTo({top:500,behavior:'instant'})")
    page.wait_for_function(active_scene + ".progress > 0")
    page.emulate_media(reduced_motion="reduce")
    page.wait_for_function("ScrollTrigger.getAll().length === 0")
    assert page.locator(".room-wall").evaluate("e => !e.style.transform")
    assert page.locator(".gallery-track").evaluate("e => !e.style.transform")
    page.emulate_media(reduced_motion="no-preference")
    page.wait_for_function("ScrollTrigger.getAll().length === 1")
    cover = page.locator("[data-selected] .art-frame img")
    identity = cover.evaluate("el => getComputedStyle(el).getPropertyValue('--artwork-transition').trim()")
    assert identity == "art-workflow"
    page.locator("#open-project").click()
    assert page.locator(".canvas-art").evaluate("el => getComputedStyle(el).getPropertyValue('--artwork-transition').trim()") == identity
    page.go_back()
    expect(page.locator("#selected-title")).to_have_text("Business Automation")
    page.wait_for_function("window.ScrollTrigger?.getAll().length === 1")
    page.go_forward()
    expect(page.locator("h1")).to_have_text("Business Automation")
    page.go_back()
    page.wait_for_function("window.ScrollTrigger?.getAll().length === 1")
    page.set_viewport_size({"width": 600, "height": 844})
    page.wait_for_function("ScrollTrigger.getAll().length === 0")
    page.locator('[data-step="1"]').click()
    expect(page.locator("#selected-title")).to_have_text("Point of Sales")
    assert not errors, errors
    context.close()

    for reduced, width in [("reduce", 1440), ("no-preference", 390), ("no-preference", 1440)]:
        context = browser.new_context(viewport={"width":width,"height":844}, reduced_motion=reduced)
        page = context.new_page()
        requested = []
        def block(route):
            requested.append(route.request.url)
            route.abort()
        page.route("**/motion-vendor/**", block)
        expects_scene = reduced != "reduce" and width >= 851
        if expects_scene:
            with page.expect_event("requestfailed", predicate=lambda req: "/motion-vendor/" in req.url):
                page.goto(base)
        else:
            page.goto(base)
        page.locator('[data-step="1"]').click()
        expect(page.locator("#selected-title")).to_have_text("Business Automation")
        page.locator(".gallery-stage").focus()
        page.keyboard.press("ArrowLeft")
        expect(page.locator("#selected-title")).to_have_text("Website Katalog Produk")
        assert bool(requested) == expects_scene
        context.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:4173")
    parser.add_argument("--browser", choices=["chromium", "webkit"], default="chromium")
    args = parser.parse_args()
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch()
        check_gallery(browser, args.base)
        browser.close()
    print(f"{args.browser}: scroll-linked scene, keyboard, history, cleanup, reduced motion and fallback passed")
