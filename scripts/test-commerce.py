"""Acceptance of local product, till and data-export workflows. No external requests."""
import argparse
import csv
import json
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright


def verify_catalog(page):
    grid = page.locator("#productDemoGrid")
    expect(grid.locator("article")).to_have_count(6)
    for image in grid.locator("img").all():
        image.scroll_into_view_if_needed()
        expect(image).to_have_js_property("complete", True)
        assert image.evaluate("img => img.naturalWidth") == 480
    page.locator("#productSort").select_option("asc")
    expect(grid.locator("h4").first).to_have_text("Kaos Boxy")
    page.locator("#productSort").select_option("desc")
    expect(grid.locator("h4").first).to_have_text("Jeans Straight")
    page.locator("#productCategory").select_option("Celana")
    page.locator("#productSearch").fill("  DENIM  ")
    expect(grid.locator("article")).to_have_count(1)
    opener = page.locator("[data-product-detail=denim]")
    opener.press("Enter")
    expect(page.locator("#productDetailTitle")).to_have_text("Jeans Straight")
    page.locator("#productSize").select_option("32")
    page.locator("#productQuantity").select_option("3")
    summary = "3 × Jeans Straight, ukuran 32 · Rp 777.000"
    expect(page.locator("#productMessage")).to_have_text(summary)
    url = urlsplit(page.locator("#productDetailWhatsApp").get_attribute("href"))
    assert url.hostname == "wa.me" and summary in parse_qs(url.query)["text"][0]
    page.locator("#addToFashionBag").click()
    expect(page.locator("#bagDraft")).to_contain_text("777.000")
    opener.click()
    page.locator("#productSize").select_option("32")
    page.locator("#addToFashionBag").click()
    expect(page.locator("#bagItems li")).to_have_count(1)
    expect(page.locator("#bagCount")).to_have_text("4 item")
    opener.click()
    page.locator("#productSize").select_option("34")
    page.locator("#addToFashionBag").click()
    expect(page.locator("#bagItems li")).to_have_count(2)
    page.locator("#bagItems button").first.click()
    expect(page.locator("#bagDraft")).to_contain_text("259.000")
    page.locator("#productSearch").fill("   <paket>   ")
    expect(page.locator("#productEmpty")).to_be_visible()
    page.locator("#clearProductFilters").click()
    expect(page.locator("#productSearch")).to_be_focused()
    page.locator("#resetProductDemo").click()
    expect(page.locator("#bagCount")).to_have_text("0 item")
    opener.click()
    page.locator("#closeProductDetail").click()
    expect(page.locator("#productDetailDialog")).to_be_hidden()
    opener.press("Enter")
    page.keyboard.press("Escape")
    expect(opener).to_be_focused()


def verify_pos(page):
    add = lambda name: page.locator(f"[data-pos-add={name}]")
    expect(page.locator("#posProductGrid button")).to_have_count(6)
    for image in page.locator("#posProductGrid img").all():
        image.scroll_into_view_if_needed()
        expect(image).to_have_js_property("complete", True)
        assert image.evaluate("img => img.naturalWidth") == 480
    for button in ("#posCheckout", "#posHold"):
        page.locator(button).click()
        expect(page.locator("#toast")).to_contain_text("sebelum")
    page.locator("#posSearch").fill("missing <x>")
    page.locator("#posClearSearch").click()
    expect(page.locator("#posSearch")).to_be_focused()
    for _ in range(2):
        add("cake").click()
    expect(add("cake")).to_be_disabled()
    page.locator("#posHold").click()
    expect(add("cake")).to_be_disabled()
    add("latte").click()
    page.locator("#posResume").click()
    expect(page.locator("#toast")).to_contain_text("pesanan aktif")
    page.locator("#posHold").click()
    page.locator("#posResume").click()
    expect(page.locator("#posCartItems")).to_contain_text("Cheesecake")
    page.locator("[data-pos-minus=cake]").click()
    expect(add("cake")).to_be_enabled()
    page.locator("#posSearch").fill("latte")
    page.locator("[data-pos-minus=cake]").press("Enter")
    expect(page.locator("#posSearch")).to_be_focused()
    page.locator("#posResume").click()
    expect(page.locator("#posCartItems")).to_contain_text("Cafe Latte")
    page.locator("#posReset").click()
    for item in ["latte", "croissant"]:
        add(item).click()
    page.locator("[data-pos-plus=latte]").click()
    page.locator("#posCustomer").select_option("Anggota B")
    page.locator("#posDiscount").select_option("5")
    if page.locator("#posViewOrder").is_visible():
        page.locator("#posViewOrder").click()
        expect(page.locator("#posCartItems")).to_be_focused()
    for id_, value in {"posSubtotal":"Rp 102.000","posDiscountValue":"- Rp 5.100","posTax":"Rp 10.659","posTotal":"Rp 107.559","posOrderDisplay":"Rp 107.559"}.items():
        expect(page.locator("#"+id_)).to_have_text(value)
    for bad in ["-100", "10.2", "1"]:
        page.locator("#posCash").fill(bad)
        page.locator("#posCheckout").click()
        expect(page.locator("#posCash")).to_have_attribute("aria-invalid","true")
        expect(page.locator("#posReceiptModal")).to_be_hidden()
    page.locator("#posCash").fill("110.000")
    for method, label in [("Card","Kartu"),("Bank","Transfer"),("Cash","Tunai")]:
        page.locator(f"[data-pos-payment={method}]").click()
        page.locator("#posCheckout").click()
        expect(page.locator("#posReceiptPayment")).to_have_text(label)
        expect(page.locator("#posReceiptTotal")).to_have_text("Rp 107.559")
        expect(page.locator("#posReceiptCustomer")).to_have_text("Anggota B")
        expect(page.locator("#posReceiptItems")).to_contain_text("2× Cafe Latte")
        if method == "Cash":
            expect(page.locator("#posReceiptChange")).to_have_text("Rp 2.441")
        else:
            expect(page.locator("#posReceiptCashLines")).to_be_hidden()
        page.keyboard.press("Escape")
    page.locator("#posCheckout").click()
    page.locator("#posReceiptNew").click()
    expect(page.locator("#posTotal")).to_have_text("Rp 0")
    expect(page.locator("#posResume")).to_be_hidden()


def verify_scraping(page):
    source = page.locator("#scrapeSource")
    pages = page.locator("#scrapePages")
    start = page.locator("#startScraping")
    table = page.locator("#scrapeTable")
    result = page.locator("#scrapeResultBox")
    pages.select_option("10")
    start.click()
    expect(start).to_be_disabled()
    expect(pages).to_be_disabled()
    page.locator("#resetScrapingDemo").click()
    source.select_option("cafe")
    pages.select_option("1")
    start.click()
    expect(page.locator("#scrapeCount")).to_have_text("2")
    expect(page.locator("#scrapeProgressText")).to_have_text("100%")
    expect(table.locator("tr")).to_have_count(2)
    pages.select_option("3")
    expect(result).to_be_hidden()
    start.click()
    source.select_option("fashion")
    expect(result).to_be_hidden()
    expect(start).to_be_enabled()
    pages.select_option("10")
    start.click()
    expect(page.locator("#scrapeTotalResult")).to_have_text("88", timeout=9000)
    expect(page.locator("#scrapeLogs div")).to_have_count(10)
    page.locator("#scrapePageSize").select_option("20")
    page.locator("#scrapeNext").click()
    expect(page.locator("#scrapePageInfo")).to_have_text("21–40 dari 88 produk")
    page.locator("#scrapePrev").click()
    for key in ["no", "nama", "harga", "rating", "stok"]:
        button = page.locator(f"th[data-sort={key}] button")
        button.press("Enter")
        expect(button.locator("..")).to_have_attribute("aria-sort","descending" if key=="no" else "ascending")
    page.locator("#scrapeNext").click()
    page.locator("th[data-sort=harga] button").click()
    expect(page.locator("#scrapePrev")).to_be_disabled()
    page.locator("#scrapeSearch").fill("Hoodie")
    page.locator("details.csv-preview summary").click()
    with page.expect_download() as action:
        page.locator("#downloadScrapeCsv").click()
    download = action.value
    assert download.suggested_filename == "scraping_result.csv"
    with download.path().open(encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))
    assert len(rows)==5 and list(rows[0])==["No","Nama","Harga","Rating","Stok"]
    assert rows[0] == {"No":"3","Nama":"Hoodie Oversize 03","Harga":"214000","Rating":"4.3","Stok":"22"}
    assert [int(row["Harga"]) for row in rows] == sorted(int(row["Harga"]) for row in rows)
    assert list(csv.DictReader(page.locator("#scrapeCsvPreview").inner_text().splitlines())) == rows[:3]
    # Deterministic clipboard permission simulation. The browser still executes the actual copy handler.
    page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async s=>window.copied=s}})")
    page.locator("#copyScrape").click()
    copied = json.loads(page.evaluate("window.copied"))
    assert [r["nama"] for r in copied]==[r["Nama"] for r in rows]
    page.evaluate("() => { navigator.clipboard.writeText=async()=>{throw new Error('permission denied')}; }")
    page.locator("#copyScrape").click()
    expect(page.locator("#toast")).to_contain_text("Gunakan Unduh CSV")
    page.locator("#scrapeSearch").fill("===<contoh>")
    expect(page.locator("#scrapePageInfo")).to_have_text("0 produk")
    for selector in ["#copyScrape","#downloadScrapeCsv","#scrapeNext","#scrapePrev"]:
        expect(page.locator(selector)).to_be_disabled()
    page.locator("#resetScrapingDemo").click()
    expect(result).to_be_hidden()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:4173")
    parser.add_argument("--browser", choices=["chromium","webkit"], default="chromium")
    args = parser.parse_args()
    with sync_playwright() as pw:
        browser = getattr(pw,args.browser).launch()
        for mobile in [False, True]:
            context = browser.new_context(**(pw.devices["iPhone 13"] if mobile else {"viewport":{"width":1440,"height":900}}), reduced_motion="reduce")
            context.route("https://**/*", lambda route: route.abort())
            page = context.new_page()
            page.set_default_timeout(6000)
            errors = []
            local_errors = []
            page.on("pageerror",lambda error: errors.append(str(error)))
            page.on("response",lambda res: local_errors.append((res.status,res.url))
                    if res.url.startswith(args.base) and res.status >= 400 else None)
            for legacy in [False, True]:
                for slug, verify in [("product-catalog",verify_catalog),("pos",verify_pos),("scraping",verify_scraping)]:
                    page.goto(args.base + ("/catalog.html#"+slug if legacy else f"/portfolio/{slug}/#canvas-demo"))
                    verify(page)
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"), slug
                print(args.browser, "mobile" if mobile else "desktop","catalog.html" if legacy else "canvas", "3 workflows passed", flush=True)
            page.route("**/fashion/linen.webp",lambda route: route.abort())
            page.goto(args.base+"/catalog.html#product-catalog")
            page.locator("[data-product-detail=linen]").click()
            expect(page.locator("#productDetailBody img")).to_have_attribute("alt","Kemeja Linen, warna gading")
            expect(page.locator("#productMessage")).to_contain_text("189.000")
            page.evaluate("location.hash='pos'")
            expect(page.locator("#productDetailDialog")).to_be_hidden()
            page.locator("[data-pos-add=latte]").click()
            expect(page.locator("#posTotal")).to_have_text("Rp 38.850")
            page.reload()
            expect(page.locator("#posTotal")).to_have_text("Rp 0")
            # Inject a one-time local data/render failure before the production initializer runs.
            page.add_init_script("""(() => {
              const original = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
              Object.defineProperty(Element.prototype, 'innerHTML', {...original, set(html) {
                if (this.id === 'productDemoGrid') {
                  Object.defineProperty(Element.prototype, 'innerHTML', original);
                  throw new Error('fixture: product list unavailable');
                }
                original.set.call(this,html);
              }});
            })()""")
            page.goto(args.base+"/portfolio/product-catalog/#canvas-demo")
            expect(page.locator("#productDemoError")).to_be_visible()
            page.locator("#retryProductDemo").click()
            expect(page.locator("#productDemoError")).to_be_hidden()
            expect(page.locator("#productDemoGrid article")).to_have_count(6)
            assert not errors, errors
            assert not local_errors, local_errors
            context.close()
        browser.close()
