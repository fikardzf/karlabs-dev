"""Detailed browser checks for the three interactive studio demos."""
import argparse
import importlib
from pathlib import Path
from urllib.parse import unquote

from playwright.sync_api import expect, sync_playwright


def chat(page):
    scenario = page.locator("#chatScenarioSelect")
    replies = page.locator("#quickReplies button")
    bot = page.locator(".chat-bubble.bot").last
    quick_topics = {
        "ecommerce": ["Hoodie Oversize", "Range harga", "Promo hari ini", "antrean simulasi"],
        "restaurant": ["Nasi Ayam", "reservasi meja", "Lunch package", "Takeaway", "antrean simulasi"],
        "clinic": ["Konsultasi umum", "Dr. Raka", "Untuk booking", "Google Maps", "antrean simulasi"],
        "course": ["Basic Web Design", "Batch malam", "299.000", "Pilih program", "antrean simulasi"],
        "motorDealer": ["Vario 160", "DP mulai", "Untuk booking test ride", "Service ringan", "antrean simulasi"],
    }
    page.clock.install()

    def settle():
        page.clock.run_for(550)
        expect(page.locator(".chat-typing")).to_have_count(0)

    for name, answers in quick_topics.items():
        scenario.select_option(name)
        expect(replies).to_have_count(len(answers))
        for index, answer in enumerate(answers):
            replies.nth(index).click()
            settle()
            expect(bot).to_contain_text(answer)
        replies.filter(has_text="Lihat ringkasan").click()
        settle()
        expect(bot).to_contain_text("Tindak lanjut")
        replies.filter(has_text="Kembali ke bot").click()
        settle()
        for rule in page.locator("#keywordRuleList button").all():
            key = rule.locator("p").inner_text().split(" #")[0][1:]
            rule.click()
            settle()
            if "Hubungi" in rule.locator("b").inner_text():
                expect(bot).to_contain_text("antrean simulasi")
            else:
                expect(bot).to_contain_text("Kata kunci · "+key)
        page.locator("#resetChatDemo").click()
        expect(page.locator(".chat-bubble")).to_have_count(1)

    scenario.select_option("course")
    message = page.locator("#chatInput")
    for text in ["sekelasnya", "biaya"]:
        message.fill(text)
        message.press("Enter")
    settle()
    turns = page.locator(".chat-bubble").all_text_contents()
    assert "sekelasnya" in turns[-4] and "Belum ada jawaban" in turns[-3]
    assert "biaya" in turns[-2] and "299.000" in turns[-1]
    message.fill(" ")
    message.press("Enter")
    expect(page.locator(".chat-bubble")).to_have_count(len(turns))
    message.fill("kelas")
    message.press("Enter")
    page.locator("#resetChatDemo").click()
    settle()
    expect(page.locator(".chat-bubble")).to_have_count(1)
    page.locator("#addKeywordRule").click()
    expect(page.locator("#customKeyword")).to_be_focused()
    rule = page.locator("#customKeyword")
    rule.fill("garansi")
    page.locator("#customResponse").fill("Cek <contoh> & kuitansi.")
    page.locator("#addKeywordRule").click()
    settle()
    expect(bot).to_contain_text("Cek <contoh> & kuitansi.")
    scenario.select_option("clinic")
    expect(page.locator("#keywordRuleList")).not_to_contain_text("garansi")
    scenario.select_option("course")
    expect(page.locator("#keywordRuleList")).to_contain_text("garansi")
    page.set_viewport_size({"width":320,"height":720})
    message.fill("x" * 300)
    message.press("Enter")
    settle()
    assert page.locator("#chatArea").evaluate("e=>e.scrollWidth <= e.clientWidth + 1")


def workflow(page):
    picker = page.locator("#workflowScenario")
    expected = {
        "lead": ["Draf balasan pelanggan", "Draf balasan pelanggan"],
        "order-basic": ["Nota pengambilan", "Nota pengambilan"],
        "email": ["Tim penjualan", "Layanan pelanggan"],
        "order": ["Daftar kemas", "Catatan kekurangan stok", "Tugas pemeriksaan pembayaran"],
        "approval": ["Lembar persetujuan belanja"]*2,
        "inventory": ["Usulan pembelian", "Catatan stok cukup"],
        "ads": ["Rekap belanja hari ini", "Catatan pemeriksaan anggaran"],
    }
    samples = page.locator("#workflowSample")
    advance = page.locator("#nextWorkflowStep")
    for name, titles in expected.items():
        picker.select_option(name)
        expect(samples.locator("option")).to_have_count(len(titles))
        inquiry = unquote(page.locator(".project-inquiry a").get_attribute("href"))
        assert picker.locator("option:checked").inner_text() in inquiry
        for ix, title in enumerate(titles):
            samples.select_option(index=ix)
            sample_id = page.locator("#workflowSource").inner_text().split(" · ")[-1]
            quantity = page.locator("#workflowAmount")
            if quantity.is_visible() and ix == 0:
                for value in ["", "-1", "0.5", str(int(quantity.get_attribute("max")) + 1)]:
                    quantity.fill(value)
                    page.locator("#startWorkflowGuide").click()
                    expect(advance).to_be_hidden()
                    expect(page.locator("#workflowGuideStatus")).to_contain_text("bilangan bulat")
                quantity.fill(quantity.get_attribute("min"))
            page.locator("#workflowDataState").select_option("missing")
            page.locator("#startWorkflowGuide").click()
            advance.click()
            expect(page.locator("#workflowGuideError")).to_be_visible()
            expect(advance).to_be_disabled()
            page.locator("#repairWorkflowData").click()
            advance.click()
            expect(page.locator("#workflowProgress [aria-current=step]")).to_have_count(1)
            advance.click()
            expect(page.locator("#workflowResultCode")).to_contain_text(sample_id)
            if ix == 0 and name in ("inventory", "ads", "order"):
                # Minimum quantity fixture intentionally affects the output.
                if name == "order":
                    title = "Catatan kekurangan stok"
            expect(page.locator("#workflowResultTitle")).to_contain_text(title)
            approve = page.locator("#workflowApprove")
            if name == "approval" and ix == 1:
                approve.dblclick()
                expect(page.locator("#workflowReviewStatus")).to_contain_text("Menunggu Pemilik usaha")
            if name == "email":
                page.locator("#workflowRevise").click()
                editor = page.locator("#workflowDraftText")
                editor.fill(" ")
                page.locator("#workflowDraftEditor button[type=submit]").click()
                assert not editor.evaluate("e=>e.checkValidity()")
                page.locator("#cancelWorkflowEdit").click()
            approve.click()
            expect(approve).to_be_hidden()
            expect(page.locator("#workflowReviewStatus")).to_contain_text("Tercatat dalam simulasi ini.")
            page.locator("#resetWorkflowGuide").click()
            expect(page.locator("#workflowRecord")).to_be_hidden()
    page.set_viewport_size({"width":1280,"height":900})
    page.locator("#workflowCatalog [data-preset=lead]").click()
    expect(picker).to_have_value("lead")


def landing(page, base):
    page.set_viewport_size({"width":1280,"height":900})
    cards = page.locator(".landing-template-card")
    expect(cards).to_have_count(17)
    catalog = [(card.locator("h4").inner_text(), card.locator(".landing-design-caption > p").first.inner_text().split(" · "))
               for card in cards.all()]
    goal = page.locator("#landingGoal")
    for chip in page.locator("#landingIndustryFilters button").all():
        industry = chip.inner_text()
        chip.click()
        for option in goal.locator("option").all():
            value = option.evaluate("el=>el.value")
            goal.select_option(value)
            count = sum((industry == "Semua" or category == industry) and (not value or wanted == value)
                        for _, (category, wanted) in catalog)
            expect(cards).to_have_count(count)
            expect(page.locator("#landingCount")).to_have_text(f"{count} contoh desain")
    page.locator('[data-filter=Semua]').click()
    goal.select_option("")
    page.locator(".preview-landing-btn").first.click()
    select = page.locator("#landingSwitch")
    for ix,(title,_) in enumerate(catalog):
        select.select_option(index=ix)
        expect(page.locator("#landingPreviewTitle")).to_have_text(title)
        assert title in unquote(page.locator("#landingInquiry").get_attribute("href"))
        frame = page.frame_locator("#landingPreviewFrame")
        expect(frame.locator(".wordmark b")).to_have_text(title)
        assert frame.locator(".hero img").evaluate("async i=>{await i.decode();return i.naturalWidth>0}")
        for offer in frame.locator(".example-action").all():
            label = offer.locator("strong").inner_text()
            offer.locator("summary").click()
            expect(offer.locator(".draft")).to_contain_text(label)
            expect(frame.locator(".example-action[open]")).to_have_count(1)
    page.locator("[data-preview-width=phone]").click()
    assert page.locator("#landingPreviewFrame").bounding_box()["width"] <= 391
    page.locator("[data-preview-width=wide]").click()
    assert page.locator("#landingPreviewFrame").bounding_box()["width"] > 390
    with page.expect_popup() as pop:
        page.locator("#openLandingNewTab").click()
    preview = pop.value
    expect(preview.locator("iframe")).to_be_visible()
    preview.reload()
    expect(preview.frame_locator("iframe").locator(".wordmark b")).to_have_text(catalog[-1][0])
    assert not preview.evaluate("Boolean(window.opener)")
    preview.get_by_role("button",name="Kembali ke demo").click()
    page.locator("#closeLandingPreview").click()
    expect(page.locator(".preview-landing-btn").first).to_be_focused()
    page.goto(base+"/public/landing-preview.html?design=missing")
    expect(page.locator("[data-unavailable] a")).to_be_visible()
    page.locator("[data-unavailable] a").click()
    expect(page.locator("#landingCount")).to_have_text("17 contoh desain")


def run(args):
    with sync_playwright() as pw:
        browser = getattr(pw,args.browser).launch()
        ctx = browser.new_context(viewport={"width":390,"height":844}, reduced_motion="reduce", locale="id-ID")
        if args.fixture_dir:
            importlib.import_module("test-showroom").configure_fixtures(ctx,args.fixture_dir)
        errors = []
        local_failures = []
        def track(page):
            page.on("pageerror",lambda err:errors.append(str(err)))
            page.on("response",lambda res:local_failures.append((res.status,res.url))
                    if res.url.startswith(args.base) and res.status>=400 else None)
        ctx.on("page",track)
        for slug,verify in [("chatbot",chat),("workflow",workflow),("landing",lambda p:landing(p,args.base))]:
            p = ctx.new_page()
            p.goto(args.base+"/portfolio/"+slug+"/#canvas-demo")
            verify(p)
            p.goto(args.base+"/catalog.html#"+slug)
            if slug=="chatbot":
                p.locator("#chatScenarioSelect").select_option("course")
                p.locator("#quickReplies button").filter(has_text="Biaya Course").click()
                expect(p.locator(".chat-bubble.bot").last).to_contain_text("299.000")
            elif slug=="workflow":
                p.locator("#workflowCatalog [data-preset=inventory]").click()
                p.locator("#startWorkflowGuide").click()
                p.locator("#resetWorkflowGuide").click()
                expect(p.locator("#workflowRecord")).to_be_hidden()
            else:
                p.locator("[data-template=coffee]").click()
                expect(p.frame_locator("#landingPreviewFrame").locator(".wordmark b")).to_have_text("Atap Temu")
            p.close()
            print(slug, "passed",flush=True)
        assert not errors,errors
        assert not local_failures,local_failures
        browser.close()


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base",default="http://localhost:4173")
    parser.add_argument("--browser",choices=["chromium","webkit"],default="chromium")
    parser.add_argument("--fixture-dir",type=Path)
    run(parser.parse_args())
