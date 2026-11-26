"""Exercise numerical results through both public interfaces of the production preview."""
import argparse
import csv
import importlib
import math
from pathlib import Path
from urllib.parse import unquote

from playwright.sync_api import expect, sync_playwright


def integer(text):
    return int(text.replace("Rp ", "").replace(".", "").split()[0])


def calculate(page):
    out = lambda key: page.locator("#" + key)
    expected = {
        "bep": ("bepUnits", [116, 120, 100]),
        "pricing": ("priceResult", [115385, 60000, 62500]),
        "ads": ("adsNetProfit", [1825000, -150000, 340000]),
        "inventory": ("invRop", [162, 180, 140]),
    }
    for tool in ["bep", "pricing", "ads", "inventory", "ongkir"]:
        page.locator(f"[data-calc={tool}]").click()
        panel = page.locator("#calc-" + tool)
        panel.locator(".calc-method summary").click()
        expect(panel.locator(".calc-method p")).to_be_visible()
        for index in range(3):
            panel.locator("[data-calc-example]").select_option(index=index)
            if tool in expected:
                key, values = expected[tool]
                assert integer(out(key).inner_text()) == values[index], (tool,index,out(key).inner_text())
            else:
                assert out("shipKg").inner_text() == ["1 kg","7 kg","1 kg"][index]
                assert integer(out("shipCost").inner_text()) == [18000,97200,18000][index]
        for field in panel.locator("[data-kind]").all():
            if field.get_attribute("data-kind") == "choice":
                field.select_option(index=1)
                continue
            field.fill("-1")
            expect(field).to_have_attribute("aria-invalid","true")
            expect(panel.locator(".calc-primary strong")).to_have_text("—")
            panel.locator("[data-calc-reset]").click()
            expect(field).to_have_attribute("aria-invalid","false")
        assert "Kalkulator Bisnis" in unquote(page.locator(".project-inquiry a, #cta-calculator .btn-primary").first.get_attribute("href"))
    page.locator("[data-calc=inventory]").click()
    for id_, value in [("invDaily","0,07"),("invLead","100"),("invSafety","0")]:
        out(id_).fill(value)
    expect(out("invRop")).to_have_text("7 unit")
    page.locator("[data-calc=bep]").click()
    out("bepDial").focus()
    out("bepDial").press("ArrowRight")
    assert int(out("bepDial").input_value()) == integer(out("bepPrice").input_value())
    page.locator("[data-calc=kpr]").click()
    for val in ["", "-100.000", "1.2", "9999999999999999", "teks"]:
        out("kprHarga").fill(val)
        out("kprHitung").click()
        expect(out("kprMonthlyResult")).to_have_text("—")
        expect(out("kprHarga")).to_have_attribute("aria-invalid","true")
    out("kprHarga").fill("500.000.000")
    for id_ in ["kprDp","kprTenor","kprBunga"]:
        out(id_).press("ArrowRight")
    principal=500000000*(1-float(out("kprDp").input_value())/100)
    months=int(out("kprTenor").input_value())*12
    rate=float(out("kprBunga").input_value())/1200
    payment=principal*rate/(1-(1+rate)**-months)
    assert integer(out("kprMonthlyResult").inner_text()) == round(payment)
    assert integer(out("kprTotalResult").inner_text()) == round(payment*months)
    page.locator("[data-calc=health]").click()
    for field,invalid in [("bmiHeight","Infinity"),("healthAge","5"),("bmiWeight","-1")]:
        old=out(field).input_value()
        out(field).fill(invalid)
        expect(out("bmiValue")).to_have_text("—")
        expect(out(field)).to_have_attribute("aria-invalid","true")
        out(field).fill(old)
    out("bmiHeight").fill("170,0")
    out("bmiWeight").fill("70")
    out("healthAge").fill("28")
    out("activityLevel").select_option("1.2")
    out("healthGender").select_option("female")
    out("bmiHitung").click()
    expect(out("bmiValue")).to_have_text("24.2")
    assert integer(out("tdeeValue").inner_text()) == math.floor((700+6.25*170-5*28-161)*1.2+.5)


def export(page):
    with page.expect_download() as dl:
        page.locator("#exportFinanceCsv").click()
    with Path(dl.value.path()).open(encoding="utf-8-sig",newline="") as f:
        return list(csv.DictReader(f))


def dashboard(page):
    out=lambda key:page.locator("#"+key)
    expect(out("reportFinding")).to_have_text("Rp 1.565.000")
    legend = page.evaluate("""() => {
        const hit = financeBar.legend.legendHitBoxes[0];
        return {x:hit.left + hit.width/2, y:hit.top + hit.height/2};
    }""")
    for visible in [False, True]:
        out("financeBar").click(position=legend)
        page.wait_for_function("v => financeBar.isDatasetVisible(0) === v", arg=visible)
    if page.viewport_size["width"] > 800:
        point = page.evaluate("""() => {
            const bar = financeBar.getDatasetMeta(0).data[0];
            return {x:bar.x, y:(bar.base + bar.y)/2};
        }""")
        out("financeBar").hover(position=point)
        page.wait_for_function("financeBar.tooltip.dataPoints?.[0]?.raw === 350000")
    page.locator(".report-palette summary").click()
    for theme in page.locator(".theme-btn").all():
        theme.click()
        assert theme.get_attribute("data-theme") in out("dashboardShell").get_attribute("class").split()
    page.locator(".formula-reference summary").click()
    expect(out("dashFormulaChips")).to_be_visible()
    for idx in range(3):
        out("financePeriod").select_option(index=idx)
        rows=export(page)
        assert len(rows)==[12,7,12][idx]
        balance=sum(int(r["Jumlah"])*(1 if r["Tipe"]=="masuk" else -1) for r in rows)
        assert balance==integer(out("reportFinding").inner_text())==int(rows[-1]["Saldo"])
        chart=page.evaluate("financeBar.data.datasets.map(s=>s.data.reduce((a,b)=>a+b,0))")
        assert chart[0]-chart[1]==balance
    out("addTransaction").click()
    form=out("transactionForm")
    for k,v in dict(tanggal="2026-11-26",kategori="  ",deskripsi="  ",jumlah="10000").items():
        form.locator(f"[name={k}]").fill(v)
    submit=form.locator("[type=submit]")
    submit.click()
    expect(form).to_be_visible()
    assert out("financeTable").locator("tr").count()==12
    form.locator("[name=kategori]").fill("Pengembalian")
    form.locator("[name=deskripsi]").fill('Kertas, "biru" & hijau')
    form.locator("[name=jumlah]").fill("9007199254740991")
    submit.click()
    expect(form).to_be_visible()
    form.locator("[name=jumlah]").fill("10000")
    form.locator("[name=tipe]").select_option("masuk")
    submit.click()
    out("financePeriod").select_option("2026-11")
    expect(out("reportFinding")).to_have_text("Rp 10.000")
    assert export(page)[0]["Deskripsi"]=='Kertas, "biru" & hijau'
    expect(out("financePie")).to_be_hidden()
    for key in ["sales","inventory","marketing"]:
        page.locator(f"[data-dashboard={key}]").click()
        for idx in range(3):
            out("reportScenario").select_option(index=idx)
            rows=export(page)
            if key=="sales":
                counts=[int(r["Jumlah"]) for r in rows]
                assert counts[-1]==[88,93,103][idx]
                assert page.evaluate("financeBar.data.datasets[0].data")==counts
                assert page.evaluate("financePie.data.datasets[0].data")==[counts[-1],260-counts[-1]]
            elif key=="inventory":
                orders=[]
                for r in rows:
                    threshold=int(r["Laku per hari"])*int(r["Waktu kirim (hari)"])+int(r["Cadangan"])
                    assert int(r["Titik pesan"])==threshold
                    stock=int(r["Stok di rak"])
                    orders.append(threshold+int(r["Laku per hari"])*7-stock if stock<=threshold else 0)
                assert orders==[int(r["Saran beli"]) for r in rows]
                assert integer(out("dashCards").locator("dd").first.inner_text())==sum(orders)
            else:
                contributions=[round(int(r["Omzet"])*float(r["Margin produk (%)"])/100-int(r["Biaya iklan"])) for r in rows]
                assert contributions==page.evaluate("financePie.data.datasets[0].data")
                assert sum(contributions)==integer(out("reportFinding").inner_text())
    page.locator("[data-dashboard=finance]").click()
    expect(out("financePeriod")).to_have_value("2026-11")
    # Explicit missing-data fixture. A visitor cannot delete the seeded ledger.
    page.evaluate("reportTransactions.length=0; refreshCashPeriods(); updateDashboard()")
    expect(out("exportFinanceCsv")).to_be_disabled()
    expect(out("dashboardTableNote")).to_contain_text("Belum ada transaksi")
    page.reload()
    expect(out("reportFinding")).to_have_text("Rp 1.565.000")


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--base",default="http://localhost:4173")
    parser.add_argument("--browser",choices=["chromium","webkit"],default="chromium")
    parser.add_argument("--fixture-dir",type=Path)
    args=parser.parse_args()
    with sync_playwright() as pw:
        browser=getattr(pw,args.browser).launch()
        for width,canvas in [(1440,True),(390,False)]:
            context=browser.new_context(viewport={"width":width,"height":900},has_touch=width<500,reduced_motion="reduce")
            if args.fixture_dir: importlib.import_module("test-showroom").configure_fixtures(context,args.fixture_dir)
            context.route("https://fonts.googleapis.com/**", lambda route: route.abort())
            page=context.new_page()
            page.set_default_timeout(7000)
            errors=[]
            page.on("pageerror",lambda error:errors.append(str(error)))
            for slug,test in [("calculator",calculate),("dashboard",dashboard)]:
                path=f"/portfolio/{slug}/#canvas-demo" if canvas else f"/catalog.html#{slug}"
                page.goto(args.base+path, wait_until="domcontentloaded")
                test(page)
                assert page.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),slug
                assert not errors,errors
                print(args.browser,width,slug,"passed",flush=True)
            context.close()
        browser.close()
