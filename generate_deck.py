import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette: Deep Space Tech Dark
    BG_COLOR = RGBColor(10, 12, 16)         # #0a0c10
    CARD_BG = RGBColor(16, 22, 34)          # #101622
    CARD_BORDER = RGBColor(30, 41, 59)      # #1e293b
    TEXT_MAIN = RGBColor(226, 232, 240)     # #e2e8f0
    TEXT_MUTED = RGBColor(100, 116, 139)    # #64748b
    AMBER = RGBColor(245, 158, 11)          # #f59e0b
    CYAN = RGBColor(6, 182, 212)            # #06b6d4
    GREEN = RGBColor(16, 185, 129)          # #10b981
    RED = RGBColor(239, 68, 68)             # #ef4444

    def apply_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()

    def add_header(slide, title_text, category_text="THREE-BODY GAME DESIGN"):
        # Category / Kicker
        tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11), Inches(0.4))
        tf_cat = tb_cat.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = CYAN

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11), Inches(0.6))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = AMBER

    # -------------------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    apply_background(slide1)

    # Accent Line
    line = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(2.2), Inches(0.1), Inches(3.2))
    line.fill.solid()
    line.fill.fore_color.rgb = AMBER
    line.line.fill.background()

    tb = slide1.shapes.add_textbox(Inches(1.8), Inches(2.1), Inches(10), Inches(3.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "《三体游戏：百家解困》"
    p0.font.size = Pt(38)
    p0.font.bold = True
    p0.font.color.rgb = AMBER

    p1 = tf.add_paragraph()
    p1.text = "The Three-Body Problem: Epoch of Philosophers"
    p1.font.size = Pt(20)
    p1.font.color.rgb = CYAN
    p1.space_after = Pt(20)

    p2 = tf.add_paragraph()
    p2.text = "基于《三体》小说原著的跨文明哲理与科学预测模拟游戏架构设计"
    p2.font.size = Pt(14)
    p2.font.color.rgb = TEXT_MAIN

    p3 = tf.add_paragraph()
    p3.text = "用人类文明史上的智慧哲学与科学工具，帮助三体文明破解“恒纪元与乱纪元”生死迷局。"
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------------------
    # SLIDE 2: Core Concept & Lore
    # -------------------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    apply_background(slide2)
    add_header(slide2, "核心设定与背景 (Core Lore & Design Objective)")

    card_data = [
        ("01 / 小说原著致敬", "完整复刻《三体》VR游戏体验：周文王卜卦、墨子暗室光球、牛顿微积分、冯·诺依曼人肉计算机。", AMBER),
        ("02 / 核心游戏目标", "在无休止的三日混沌引力中，预测恒纪元与乱纪元，发布【脱水/浸泡】指令，延续三体文明。", CYAN),
        ("03 / 玩法类型定位", "策略模拟 + 哲人卡牌构筑 + 灾难生存管理 (Strategy / Simulation / Roguelite)。", GREEN)
    ]

    left_positions = [Inches(0.8), Inches(4.8), Inches(8.8)]
    for idx, (title, body, accent_color) in enumerate(card_data):
        c = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_positions[idx], Inches(1.8), Inches(3.7), Inches(4.8))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1.5)

        tb_c = slide2.shapes.add_textbox(left_positions[idx] + Inches(0.2), Inches(2.0), Inches(3.3), Inches(4.4))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True

        p_t = tf_c.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = accent_color
        p_t.space_after = Pt(14)

        p_b = tf_c.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(13)
        p_b.font.color.rgb = TEXT_MAIN
        p_b.line_spacing = 1.3

    # -------------------------------------------------------------------------
    # SLIDE 3: Core Gameplay Loop
    # -------------------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    apply_background(slide3)
    add_header(slide3, "核心玩法循环 (Core Gameplay Loop)")

    steps = [
        ("Phase 1: 观天象", "观察太阳数量、温度、飞星轨迹、单摆周期", AMBER),
        ("Phase 2: 集智者", "招募/组合哲人卡牌 (文王/墨子/牛顿/冯诺依曼)", CYAN),
        ("Phase 3: 定策略", "发布预测报告，下达【脱水 / 浸泡】行政指令", GREEN),
        ("Phase 4: 历纪元", "经历毁灭与重构，将思想遗产传承至下一个文明", RED)
    ]

    step_lefts = [Inches(0.8), Inches(3.8), Inches(6.8), Inches(9.8)]
    for idx, (s_title, s_desc, s_color) in enumerate(steps):
        c = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, step_lefts[idx], Inches(2.2), Inches(2.7), Inches(4.0))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER

        tb_s = slide3.shapes.add_textbox(step_lefts[idx] + Inches(0.15), Inches(2.4), Inches(2.4), Inches(3.6))
        tf_s = tb_s.text_frame
        tf_s.word_wrap = True

        p_t = tf_s.paragraphs[0]
        p_t.text = s_title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = s_color
        p_t.space_after = Pt(12)

        p_d = tf_s.add_paragraph()
        p_d.text = s_desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = TEXT_MAIN
        p_d.line_spacing = 1.3

    # -------------------------------------------------------------------------
    # SLIDE 4: Philosophers & Models
    # -------------------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    apply_background(slide4)
    add_header(slide4, "哲人学派与预测模型 (Philosophers & Predictors)")

    phils = [
        ("周文王 / 伏羲", "易经卦象卜筮", "推演八卦阴阳预测恒纪元，低成本但准确度极低", AMBER),
        ("墨子", "墨家光学暗室", "通过双层铜球观察室捕捉近距离双日凌空预警", CYAN),
        ("牛顿 & 莱布尼茨", "万有引力与微积分", "利用微分方程求解二体问题，对复杂三体容易崩溃", GREEN),
        ("冯·诺依曼 & 秦始皇", "三千万士兵人肉计算机", "搭建与/或/非逻辑门阵列，高并行算力数值求解", AMBER)
    ]

    p_lefts = [Inches(0.8), Inches(6.8)]
    p_tops = [Inches(1.8), Inches(4.3)]

    for idx, (p_name, p_school, p_detail, p_col) in enumerate(phils):
        l = p_lefts[idx % 2]
        t = p_tops[idx // 2]

        c = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, Inches(5.7), Inches(2.2))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER

        tb_p = slide4.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.9))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True

        p_head = tf_p.paragraphs[0]
        p_head.text = f"{p_name} — 《{p_school}》"
        p_head.font.size = Pt(14)
        p_head.font.bold = True
        p_head.font.color.rgb = p_col
        p_head.space_after = Pt(6)

        p_det = tf_p.add_paragraph()
        p_det.text = p_detail
        p_det.font.size = Pt(12)
        p_det.font.color.rgb = TEXT_MAIN

    # -------------------------------------------------------------------------
    # SLIDE 5: Technical Architecture
    # -------------------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    apply_background(slide5)
    add_header(slide5, "技术架构与核心物理引擎 (Technical Architecture)")

    arch_cards = [
        ("N-Body 物理引擎", "基于 Runge-Kutta 4th Order 算法，实时计算三颗恒星与行星引力轨迹，生成真实混沌气候。", AMBER),
        ("三体环境演算", "根据距离与辐射逆平方律，动态计算地表温度 (-150°C ~ 350°C) 及可见太阳数。", CYAN),
        ("前端渲染与UI", "HTML5 Canvas 2D / Three.js 极简发光宇宙画风，打造原著 VR 终端沉浸感。", GREEN)
    ]

    for idx, (a_title, a_desc, a_col) in enumerate(arch_cards):
        top_pos = Inches(1.8 + idx * 1.7)
        c = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, Inches(11.7), Inches(1.4))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER

        tb_a = slide5.shapes.add_textbox(Inches(1.0), top_pos + Inches(0.15), Inches(11.3), Inches(1.1))
        tf_a = tb_a.text_frame
        tf_a.word_wrap = True

        p_at = tf_a.paragraphs[0]
        p_at.text = a_title
        p_at.font.size = Pt(15)
        p_at.font.bold = True
        p_at.font.color.rgb = a_col
        p_at.space_after = Pt(4)

        p_ad = tf_a.add_paragraph()
        p_ad.text = a_desc
        p_ad.font.size = Pt(12)
        p_ad.font.color.rgb = TEXT_MAIN

    # -------------------------------------------------------------------------
    # SLIDE 6: Demo Prototype Showcase
    # -------------------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    apply_background(slide6)
    add_header(slide6, "MVP 原型展示 (Playable Prototype Showcase)")

    box_left = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(6.0), Inches(5.0))
    box_left.fill.solid()
    box_left.fill.fore_color.rgb = CARD_BG
    box_left.line.color.rgb = AMBER

    tb_bl = slide6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.6), Inches(4.6))
    tf_bl = tb_bl.text_frame
    tf_bl.word_wrap = True

    p0 = tf_bl.paragraphs[0]
    p0.text = "🎯 已完成 MVP 原型 (index.html)"
    p0.font.size = Pt(16)
    p0.font.bold = True
    p0.font.color.rgb = AMBER
    p0.space_after = Pt(10)

    bullets = [
        "✅ 完整运行三体 N-body 物理粒子与轨迹推演",
        "✅ 包含【脱水 / 浸泡】行政命令与人口死亡机制",
        "✅ 实时遥测地表温度、太阳数量与灾难预警",
        "✅ 动态接入周文王、墨子、牛顿、冯诺依曼等哲人预测",
        "✅ 完整文明毁灭与【第 N 号文明重生】循环"
    ]
    for b in bullets:
        pb = tf_bl.add_paragraph()
        pb.text = b
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_MAIN
        pb.space_after = Pt(8)

    # Right side code preview block
    box_right = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(1.8), Inches(5.4), Inches(5.0))
    box_right.fill.solid()
    box_right.fill.fore_color.rgb = RGBColor(5, 7, 10)
    box_right.line.color.rgb = CARD_BORDER

    tb_br = slide6.shapes.add_textbox(Inches(7.3), Inches(2.0), Inches(5.0), Inches(4.6))
    tf_br = tb_br.text_frame
    tf_br.word_wrap = True

    p_code_t = tf_br.paragraphs[0]
    p_code_t.text = "// 本地运行地址 (Local Preview):"
    p_code_t.font.size = Pt(12)
    p_code_t.font.color.rgb = CYAN
    p_code_t.space_after = Pt(10)

    p_code_url = tf_br.add_paragraph()
    p_code_url.text = "http://localhost:8088/index.html"
    p_code_url.font.size = Pt(14)
    p_code_url.font.bold = True
    p_code_url.font.color.rgb = AMBER
    p_code_url.space_after = Pt(16)

    p_code_desc = tf_br.add_paragraph()
    p_code_desc.text = "直接使用浏览器打开即可进行实时试玩体验。单文件零依赖设计，可轻松部署为 Web 平台应用。"
    p_code_desc.font.size = Pt(12)
    p_code_desc.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------------------
    # SLIDE 7: Roadmap
    # -------------------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    apply_background(slide7)
    add_header(slide7, "未来路线图 (Product Roadmap)")

    phases = [
        ("Phase 1: 概念与 MVP", "三体引力模拟 + 脱水系统 + 基础哲人", AMBER),
        ("Phase 2: 人肉计算机", "引入三千万士兵逻辑门电路拼装小游戏", CYAN),
        ("Phase 3: 巨型单摆", "引入引力谐振控制与地热能采集机制", GREEN),
        ("Phase 4: 多人三体星空", "玩家实时联合预测与智子干扰对抗", RED)
    ]

    for idx, (ph_name, ph_desc, ph_col) in enumerate(phases):
        top_pos = Inches(1.8 + idx * 1.3)
        c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, Inches(11.7), Inches(1.1))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER

        tb_ph = slide7.shapes.add_textbox(Inches(1.0), top_pos + Inches(0.1), Inches(11.3), Inches(0.9))
        tf_ph = tb_ph.text_frame
        tf_ph.word_wrap = True

        p_pht = tf_ph.paragraphs[0]
        p_pht.text = ph_name
        p_pht.font.size = Pt(14)
        p_pht.font.bold = True
        p_pht.font.color.rgb = ph_col

        p_phd = tf_ph.add_paragraph()
        p_phd.text = ph_desc
        p_phd.font.size = Pt(12)
        p_phd.font.color.rgb = TEXT_MAIN

    # Save presentation
    output_path = "/Users/bradwoo/threebody/three_body_game_design.pptx"
    prs.save(output_path)
    print(f"Presentation saved to {output_path}")

if __name__ == "__main__":
    build_deck()
