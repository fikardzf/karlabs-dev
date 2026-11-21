"""Browser acceptance checks. Run against npm run preview with Python Playwright installed."""

import argparse
import base64
import hashlib
from pathlib import Path
from urllib.parse import unquote

from playwright.sync_api import expect, sync_playwright


def configure_fixtures(context, directory):
    def handler(payload):
        def serve(route):
            route.fulfill(body=payload, content_type="application/javascript",
                          headers={"Access-Control-Allow-Origin": "*"})
        return serve

    assets = [
        ("**/lucide.min.js", "lucide.min.js", "v15JX+vZHMR3T6LQR9N6e6wIKrKOdNTbdj8j+e5irqq3L9gCauJz2vGlUzomWyUp"),
        ("**/chart.umd.min.js", "chart.js", "jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ"),
    ]
    for pattern, filename, integrity in assets:
        payload = (directory / filename).read_bytes()
        assert base64.b64encode(hashlib.sha384(payload).digest()).decode() == integrity
        context.route(pattern, handler(payload))


def verify(page, base):
    def visit(slug):
        page.goto(f"{base}/portfolio/{slug}/#canvas-demo")
        expect(page.locator(".service-panel")).to_have_attribute("aria-busy", "false")
        title = page.locator("h1").inner_text()
        for link in [".project-inquiry a", ".studio-header .consult-link"]:
            assert title in unquote(page.locator(link).get_attribute("href"))

    page.goto(base)
    page.locator('[data-filter="website"]').click()
    page.locator("#open-project").click()
    page.locator("#productSearch").fill("latte")
    page.locator("[data-product-detail=latte]").click()
    page.locator("#productServing").select_option(label="Dingin")
    expect(page.locator("#productMessage")).to_contain_text("Cafe Latte (dingin)")
    page.locator("#closeProductDetail").click()
    page.locator("#productSearch").fill("tidak ditemukan")
    expect(page.locator("#productEmpty")).to_be_visible()
    page.locator("#clearProductFilters").click()
    page.locator("#productCategory").select_option("Bakery")
    page.locator("[data-product-detail=croissant]").click()
    expect(page.locator("#productServing")).to_be_hidden()
    expect(page.locator("#productMessage")).to_contain_text("Butter Croissant")
    page.locator("#closeProductDetail").click()
    page.locator("[data-gallery-back]").first.click()
    expect(page.locator("[data-filter=website]")).to_have_attribute("aria-pressed", "true")
    page.goto(base + "/#harga")
    page.locator(".package-picker button").last.click()
    page.locator('[data-inquiry-package="Premium"]').click()
    expect(page.locator("#inquiry-package")).to_contain_text("Premium")

    visit("workflow")
    page.locator("#workflowScenario").select_option("order-basic")
    page.locator("#workflowSample").select_option("bakery")
    page.locator("#startWorkflowGuide").click()
    page.locator("#workflowDataState").select_option("missing")
    page.locator("#nextWorkflowStep").click()
    expect(page.locator("#workflowGuideError")).to_be_visible()
    page.locator("#repairWorkflowData").click()
    page.locator("#nextWorkflowStep").click()
    page.locator("#nextWorkflowStep").click()
    expect(page.locator(".workflow-draft")).to_contain_text("3 croissant")

    visit("pos")
    page.locator("[data-pos-add=latte]").click()
    page.locator("[data-pos-plus=latte]").focus()
    page.keyboard.press("Enter")
    expect(page.locator("[data-pos-plus=latte]")).to_be_focused()
    page.locator("#posDiscount").select_option("10")
    page.locator("#posCheckout").click()
    # Two Rp35,000 lattes, 10% discount, 11% simulated tax on the net.
    expect(page.locator("#posReceiptTotal")).to_contain_text("69.930")
    page.locator("#posReceiptClose").click()

    visit("chatbot")
    page.locator(".quick-reply").first.click()
    expect(page.locator(".chat-bubble").last).to_contain_text("Hoodie")
    page.locator(".quick-reply").filter(has_text="Admin").first.click()
    page.get_by_role("button", name="Lihat ringkasan", exact=True).click()
    expect(page.locator(".chat-bubble").last).to_contain_text("Katalog Produk")
    page.get_by_role("button", name="Kembali ke bot", exact=True).click()
    expect(page.locator(".chat-bubble").last).to_contain_text("pertanyaan lain")

    visit("calculator")
    page.locator("#bepPrice").fill("85000")
    expect(page.locator("#bepUnits")).to_have_text("Belum tercapai")
    page.locator("#resetBep").click()
    expect(page.locator("#bepUnits")).to_have_text("116 unit")
    page.locator("[data-calc=ads]").click()
    page.locator("#adsOrders").fill("0")
    expect(page.locator("#adsCac")).to_have_text("Belum ada pesanan")
    page.locator("[data-calc=health]").click()
    page.locator("#bmiHeight").fill("")
    expect(page.locator("#bmiValue")).to_have_text("—")

    visit("dashboard")
    page.locator("#financePeriod").select_option("week")
    expect(page.locator("#financeTable tr")).to_have_count(7)
    page.locator("#addTransaction").click()
    form = page.locator("#transactionForm")
    for key, value in [("tanggal", "2026-11-22"), ("kategori", "Penjualan"),
                       ("deskripsi", "Pesanan uji"), ("jumlah", "25000")]:
        form.locator(f"[name={key}]").fill(value)
    form.locator("[name=tipe]").select_option("masuk")
    form.locator("button[type=submit]").click()
    page.locator("#financePeriod").select_option("2026-11")
    expect(page.locator("#financeTable tr")).to_have_count(1)
    expect(page.locator("#dashCards")).to_contain_text("25.000")
    assert page.evaluate("financeBar.data.datasets[0].data") == [25000]
    page.locator("[data-dashboard=sales]").click()
    assert page.evaluate("financePie.data.datasets[0].data") == [88, 172]

    visit("scraping")
    page.locator("#scrapeSource").select_option("cafe")
    page.locator("#startScraping").click()
    expect(page.locator("#scrapeTotalResult")).to_have_text("6")
    page.locator(".csv-preview summary").click()
    with page.expect_download() as downloaded:
        page.locator("#downloadScrapeCsv").click()
    csv = Path(downloaded.value.path()).read_text(encoding="utf-8-sig").splitlines()
    assert len(csv) == 7
    assert csv[:4] == page.locator("#scrapeCsvPreview").inner_text().splitlines()
    page.locator("#scrapeSearch").fill("latte")
    expect(page.locator("#scrapeTable tr")).to_have_count(1)
    expect(page.locator("#scrapeTable")).to_contain_text("Cafe Latte")
    page.locator("#scrapeSource").select_option("fashion")
    expect(page.locator("#scrapeResultBox")).to_be_hidden()

    visit("landing")
    with page.expect_popup() as popup_context:
        page.locator(".preview-landing-btn").first.click()
    popup = popup_context.value
    frame = popup.frame_locator("iframe")
    frame.locator(".example-action summary").first.click()
    expect(frame.locator(".example-action[open]")).to_contain_text("Contoh pesan pelanggan")
    popup.close()
    page.set_viewport_size({"width": 1440, "height": 900})
    page.locator(".preview-landing-btn").first.click()
    expect(page.locator("#landingPreviewModal")).to_be_visible()
    page.locator("#landingSwitch").select_option(index=1)
    page.frame_locator("#landingPreviewFrame").get_by_text("Lihat rincian", exact=True).click()
    expect(page.frame_locator("#landingPreviewFrame").locator("details[open] p")).to_be_visible()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:4173")
    parser.add_argument("--browser", choices=["chromium", "webkit"], default="chromium")
    parser.add_argument("--fixture-dir", type=Path, help="Optional local copies of the two pinned CDN scripts.")
    args = parser.parse_args()
    with sync_playwright() as playwright:
        browser = getattr(playwright, args.browser).launch()
        context = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True, reduced_motion="reduce")
        if args.fixture_dir:
            configure_fixtures(context, args.fixture_dir)
        page = context.new_page()
        page.set_default_timeout(7000)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        verify(page, args.base.rstrip("/"))
        assert not errors, errors
        browser.close()
        print(f"{args.browser}: gallery, package inquiry and eight demo journeys passed")
