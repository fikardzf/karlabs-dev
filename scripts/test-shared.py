"""Regression journeys for shared navigation, recovery and preparing a local inquiry."""
import argparse
from importlib import import_module
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright


def check_inquiry(page, base, mobile):
    page.goto(base + "/#harga")
    if mobile:
        picker = page.locator(".package-picker")
        picker.locator("button").first.press("End")
        expect(picker.locator("button").last).to_have_attribute("aria-pressed", "true")
    details = page.locator(".package-card").filter(has=page.locator('[data-inquiry-package="Premium"]')).locator(".package-details")
    details.locator("summary").click()
    expect(details.locator(".package-details-body")).to_be_visible()
    page.locator('[data-inquiry-package="Premium"]').click()
    form = page.locator("#contact-form")
    submit = form.locator('[type="submit"]')
    submit.click()
    expect(page.locator("#consultation-errors")).to_be_focused()
    page.locator('#consultation-error-list [href="#nama"]').click()
    expect(page.locator("#nama")).to_be_focused()
    for key, value in [("nama", "Penguji"), ("usaha", "Toko contoh"), ("pesan", "Harga & ukuran / 2 varian"), ("kontak-calon-client", "nomor")]:
        form.locator("#" + key).fill(value)
    expect(page.locator("#kontak-error")).to_be_visible()
    page.locator("#kontak-calon-client").fill("uji@example.test")
    page.locator("#jasa").select_option("Website Katalog Produk")
    form.locator("details summary").click()
    for key in ("anggaran", "target-waktu"):
        field = page.locator("#" + key)
        if field.evaluate("e=>e.tagName") == "SELECT":
            field.select_option(index=1)
        else:
            field.fill("Dalam dua bulan")
    submit.click()
    expect(page.locator("#whatsapp-preview")).to_be_focused()
    draft = page.locator("#whatsapp-message").inner_text()
    for string in ("Premium", "Harga & ukuran / 2 varian", "uji@example.test", "Website Katalog Produk"):
        assert string in draft
    for link in page.locator("[data-lead-handoff]").all():
        url = urlsplit(link.get_attribute("href"))
        assert url.hostname == "wa.me" and parse_qs(url.query)["text"] == [draft]
    page.locator("#clear-inquiry-package").click()
    expect(page.locator("#whatsapp-preview")).to_be_hidden()
    assert page.locator("[data-lead-handoff][href]").count() == 0
    submit.click()
    expect(page.locator("#whatsapp-message")).not_to_contain_text("Premium")
    page.locator(".studio-disclosure").filter(has=page.locator(".faq-list")).locator("summary").first.click()
    for trigger in page.locator(".faq-trigger").all():
        trigger.press("Enter")
        expect(page.locator("#" + trigger.get_attribute("aria-controls"))).to_be_visible()
        trigger.press("Space")
        expect(trigger).to_have_attribute("aria-expanded", "false")


def check_routes(page, base):
    def wait_for_canvas():
        page.locator("#canvas-demo").scroll_into_view_if_needed()
        expect(page.locator(".service-panel.active")).to_have_attribute("aria-busy", "false")
        expect(page.locator("#demo-status")).to_be_hidden()

    page.goto(base + "/portfolio/?filter=invalid")
    cards = page.locator(".collection-grid .exhibit")
    catalog = [(el.get_attribute("data-slug"), el.get_attribute("data-category")) for el in cards.all()]
    assert len(catalog) == 8
    for category in dict.fromkeys(category for _, category in catalog):
        page.locator('[data-filter="'+category+'"]').click()
        visible = [slug for slug, group in catalog if group == category]
        expect(page.locator(".exhibit:visible")).to_have_count(len(visible))
        for i, slug in enumerate(visible):
            page.locator('.exhibit[data-slug="'+slug+'"]').click()
            page.locator('a[href="#canvas-demo"].ink-button').click()
            panel = page.locator(".service-panel.active")
            expect(panel).to_have_attribute("id", slug)
            expect(panel).to_have_attribute("aria-busy", "false")
            expect(page.locator("#demo-status")).to_be_hidden()
            if len(visible) > 1:
                for selector, step in (("[data-next]", 1), ("[data-prev]", -1)):
                    link = page.locator(selector)
                    expected = visible[(i + step) % len(visible)]
                    assert urlsplit(link.get_attribute("href")).path == "/portfolio/"+expected+"/"
                    link.click()
                    expect(page.locator(".service-panel.active")).to_have_attribute("id", expected)
                    wait_for_canvas()
                    page.go_back()
                    wait_for_canvas()
            else:
                expect(page.locator("[data-next]")).to_be_hidden()
                expect(page.locator("[data-prev]")).to_be_hidden()
            page.reload()
            wait_for_canvas()
            page.locator("[data-gallery-back]").first.click()
            expect(page.locator(".gallery-room [data-selected]")).to_have_attribute("data-slug", slug)
            page.goto(base + "/portfolio/?filter=" + category)


def check_discovery(page, base):
    page.goto(base + "/catalog.html#kasir")
    expect(page.locator("#pos")).to_be_visible()
    menu = page.locator("[data-catalog-menu]")
    if menu.is_visible():
        menu.locator("summary").click()
        expect(menu.locator("a").first).to_be_visible()
        page.keyboard.press("Escape")
        expect(menu.locator("summary")).to_be_focused()
    page.locator("#serviceGuide summary").click()
    expect(page.locator("#serviceGuide ol")).to_be_visible()
    page.locator("#pos [data-service-cta] summary").click()
    expect(page.locator("#pos [data-service-cta] .value-grid")).to_be_visible()
    page.locator("#backTop").click()
    page.wait_for_function("scrollY < 5")
    page.locator("#discoveryFilters summary").click()
    page.locator("#discoveryProblem").select_option("kasir")
    page.locator("#discoveryBusiness").select_option("jasa")
    expect(page.locator("#discoveryResults")).to_contain_text("Belum ada demo")
    page.locator("#resetDiscovery").click()
    expect(page.locator("#discoveryResults a")).to_have_count(2)
    page.locator('#discoveryResults [data-service-link="product-catalog"]').click()
    page.locator("[data-product-detail]").first.click()
    expect(page.locator("#productDetailDialog")).to_be_visible()
    page.go_back()
    expect(page.locator("#pos")).to_be_visible()
    expect(page.locator("#productDetailDialog")).to_be_hidden()


def check_recovery(page, base):
    pending = []
    page.route("**/catalog-pos.js?*", lambda route: pending.append(route), times=1)
    with page.expect_request("**/catalog-pos.js?*"):
        page.goto(base + "/portfolio/pos/#canvas-demo", wait_until="domcontentloaded")
    expect(page.locator("#demo-status")).to_contain_text("Memuat demo")
    expect(page.locator("#pos")).to_have_attribute("aria-busy", "true")
    assert page.locator("#pos").evaluate("el=>el.inert")
    expect(page.locator("#demo-status button")).to_be_hidden()
    assert len(pending) == 1
    pending[0].continue_()
    expect(page.locator("#demo-status")).to_be_hidden()
    expect(page.locator("[data-pos-add]")).to_have_count(6)
    page.route("**/catalog-product.js?*", lambda route: route.abort(), times=1)
    page.goto(base + "/portfolio/product-catalog/#canvas-demo")
    retry = page.locator("#demo-status button")
    expect(retry).to_be_visible()
    assert page.locator(".service-panel").evaluate("el=>el.inert")
    retry.click()
    expect(retry).to_be_hidden()
    expect(page.locator("#productDemoGrid article")).to_have_count(6)
    page.route("**/chart.umd.min.js", lambda route: route.abort(), times=1)
    page.goto(base + "/catalog.html#dashboard")
    expect(page.locator("#retryChartFeature")).to_be_visible()
    assert page.locator("#dashboard").evaluate("el=>el.inert")
    page.locator("#retryChartFeature").click()
    expect(page.locator("#chartFeatureStatus")).to_be_hidden()
    expect(page.locator("#reportFinding")).to_have_text("Rp 1.565.000")
    assert not page.locator("#dashboard").evaluate("el=>el.inert")
    page.route("**/portfolio-art/product-catalog*.webp*", lambda route: route.abort())
    page.goto(base + "/?project=product-catalog")
    expect(page.locator("#selected-title")).to_have_text("Website Katalog Produk")
    page.locator("#open-project").click()
    expect(page.locator("h1")).to_have_text("Website Katalog Produk")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:4173")
    parser.add_argument("--browser", choices=["chromium", "webkit"], default="chromium")
    parser.add_argument("--fixture-dir", type=Path, required=True)
    args = parser.parse_args()
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch()
        for width in [1440, 390]:
            ctx = browser.new_context(viewport={"width": width, "height": 900}, has_touch=width == 390, reduced_motion="reduce")
            ctx.route("https://**/*", lambda route: route.abort())
            import_module("test-showroom").configure_fixtures(ctx, args.fixture_dir)
            page = ctx.new_page()
            page.set_default_timeout(7000)
            errors = []
            local_failures = []
            console_errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" and msg.location.get("url", "").startswith(args.base) else None)
            page.on("response", lambda res: local_failures.append((res.status, res.url)) if res.status >= 400 and res.url.startswith(args.base) else None)
            page.on("requestfailed", lambda req: local_failures.append(req.url) if req.url.startswith(args.base) and "ABORT" not in (req.failure or "").upper() and "CANCEL" not in (req.failure or "").upper() else None)
            check_inquiry(page, args.base, width == 390)
            check_routes(page, args.base)
            check_discovery(page, args.base)
            assert not local_failures, local_failures
            assert not console_errors, console_errors
            check_recovery(page, args.base)
            assert not errors, errors
            print(f"{args.browser} {width}px: inquiry, routes, history, discovery and recovery passed", flush=True)
            ctx.close()
        browser.close()
