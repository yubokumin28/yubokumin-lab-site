# 遊牧民ラボ ワンショット制作キット（動画手順を私用にアレンジ）

> 元ネタ: Shreyas Raj「AURA Ring」ワンショット集。それを **遊牧民ラボ** 用に全面改修したもの。
> 変更の柱：①主役の3Dは「リング」→「アザラシ」、②3Dは重いR3Fをやめ **無料の `<model-viewer>`**、
> ③フレームワークは Next.js をやめ **ビルド不要の静的サイト**（旦那様の既存サイトと同じ・Netlifyにドラッグで公開）、
> ④配色は **モルディブ・リゾート**、⑤画像は **自宅GPUローカル生成** を第一候補。
> em dash（—）は使わない。完成前に必ずブラウザ（Playwright/プレビュー）で目視確認。

---

## 0. ワンショット構築プロンプト（このブロックを丸ごと Claude Code に貼る）

```
遊牧民ラボのトップサイトを作って。スクロールで主役の3Dアザラシが画面内を移動する、
高級感のあるプロダクト風ランディングページ。技術はビルド不要の静的構成
（素のHTML/CSS/JS）。3DはGoogleの <model-viewer> でGLBを表示。スクロール演出は
GSAP ScrollTrigger（scrubではなくコールバック方式）、慣性スクロールはLenis。
世界観は「Appleのキーノート × モルディブのリゾート × ぷかぷか浮かぶアザラシ」。

譲れない制約:
1. プロジェクトは C:\ClaudeCode\260620_yubokumin-lab-site\ の中だけで作る。
2. 主役の3Dアザラシは1体。スクロールで各セクションへ移動するが、移動は
   onEnter/onLeaveBack のコールバックで gsap.to(duration:0.7, ease:'power3.inOut',
   overwrite:true) を使う。scrubは隣接トリガーで逆方向補間のリセット глюを起こすので使わない。
3. ヒーローのアザラシは自分のScrollTriggerを持たない。初期 gsap.set がヒーローの定位置。
   最初のScrollTriggerは #story を狙う（ヒーロー中はアザラシが静止する保証）。
4. 全トランジションに overwrite:true（速いスクロールで隣接トリガーが綺麗にキャンセル）。
5. アザラシは常時ゆっくり上下に「ぷかぷか」浮く（useFrame相当の軽いCSS/JSループ）。
6. ヒーロー背景はリゾートの8秒ループ動画。オーバーレイ無し。コントラストはvideo自体に
   CSS filter: contrast(1.15) saturate(1.12) brightness(1.02)。
7. em dash（—）禁止。読点・句点で書く。
8. すりガラス(liquid glass)は LiquidGlassCard 1コンポーネントに集約（backdrop-filter blur
   ＋ SVG turbulence ＋ 多層ハイライト ＋ 外側グロー）。各所で自作しない。
9. 画面を白いアザラシが横切る「泳ぐアザラシ」演出を全ページ共通で入れる（position:fixed,
   低opacity, pointer-events:none, 8〜30秒で横断ループ, prefers-reduced-motionで停止）。
10. 既存資産を流用する: assets/ の seal/ seal-new/ swimming.png chars/ と、
    各ツールの実スクショ shots/ ・帯バナー shots/banners/ をそのまま使う。

必ず作るもの:
- 静的トップ index.html（下記セクション順）＋ 共有 css/ js/
- 固定ナビ（すりガラス）。左=遊牧民ラボのロゴ（アザラシ顔）、右=「声をかける」CTA
- 上部に4メッセージを4.2秒ごとに回すアナウンスバー（任意）
- ピン留めされた <model-viewer> アザラシが Hero→Story→Tools→Profile→Contact を移動し、
  数字セクションでは静止、フッター手前でフェードアウト
- セクション順: AnnouncementBar(任意), Nav, 3Dアザラシ canvas, Hero, Story,
  Tools(6カード=帯バナー＋タイトル), Profile, Stats(カウントアップ), Contact/Footer
- スクロール進捗バー（上部・珊瑚グラデ）
- カスタムカーソル(dot即追従+ring慣性) ＋ 磁石ボタン ＋ カード3Dチルト＋珊瑚グロー
- Netlify用に公開できる形（静的なのでフォルダごとドラッグでOK。netlify.tomlは不要）

完成前に必ずプレビューで全セクションをスクロール確認し、コンソールエラーが無いこと、
スマホ幅で崩れないこと（横スクロール/ピンは縦積みにフォールバック）を確認してから渡す。
```

---

## 1. 技術スタック（動画のNext.js+R3Fから「軽量化」）
| 項目 | 動画(AURA) | 遊牧民ラボ版（推奨） | 理由 |
|---|---|---|---|
| 土台 | Next.js 14 + TS | **素のHTML/CSS/JS（ビルド不要）** | 非プログラマーでも扱える・Netlifyにドラッグで公開・既存サイトと同じ |
| 3D | React Three Fiber | **`<model-viewer>`（Google製・無料・透かし無し）** | GLBをタグ1つで表示・回転・自動ライティング。軽くスマホで滑らか |
| スクロール演出 | GSAP ScrollTrigger | 同じ（**callback方式**） | 動画のノウハウ（reset глю回避）をそのまま使う |
| 慣性スクロール | Lenis | 同じ | SANKOU級の「ぬるっと感」 |
| すりガラス | 自作CSS | 同じ（LiquidGlassCard） | 高級感の要 |

CDNで読むだけ（`<script>`）：Lenis / GSAP / ScrollTrigger / `@google/model-viewer`。

## 2. 配色トークン（リゾート）
```
lagoon  : #eafaf8 #c9f1ee #4fd3cc #129ca0 #0b626e #073b4c   (海)
sand    : #fdfbf6 #faf5ea #f3e9d6 #e9d9bd                    (白砂)
coral   : #ff7a59  / coral-d #f0603d                         (アクセント)
sun     : #ffc857   palm #2f9e7d  foam #fff                  (差し色)
ink     : #0c2b33   soft #3c5b62   mute #6f8a90              (文字)
font    : 見出し=Zen Maru Gothic / 本文=Zen Kaku Gothic New / 英=Outfit
```

## 3. 3Dの主役（リング→アザラシ）
- GLBを `assets/models/seal.glb` に置き、`<model-viewer src auto-rotate camera-controls disable-zoom>` で表示。
- GLBの作り方は STEP「3Dモデル」（Meshy無料枠 or Tripo に既存のアザラシ画像を入れて image-to-3D → HDテクスチャ → GLB書き出し）。
- 当面はGLBが無くてもよい：その場合ヒーローは既存Splineアザラシ or `swimming.png` のフォールバックで動かす。

## 4. スクロール振り付け（model-viewer版）
- アザラシは `position:fixed` のラッパー内の `<model-viewer>`。ラッパーの transform を GSAP が動かす。
- ポーズ表（px/py/scale）をセクションごとに定義し、#story #tools #profile #contact の onEnter/onLeaveBack で `gsap.to(... overwrite:true, duration:0.7, power3.inOut)`。
- 数字セクションは静止（staticGlue=set）。フッター手前で opacity 0。
- `prefers-reduced-motion` 時は移動を無効化し各セクションに静止配置。

## 5. セクションと日本語コピー（遊牧民ラボ版）
```
HERO    eyebrow: Portfolio of an AI nomad
        headline: PC1台で、海の向こうから自動化を。
        sub: 建設の現場で働きながら、ひとりでAIツールを作り続ける「遊牧民」の実績集。
        CTA: 6つのツールを見る →
STORY   eyebrow: The story
        headline: 「遊牧民」は、場所に縛られずに働く。
        body: 朝は現場、夜はコード。ノートPC1台あれば、ラグーンの上でも仕事は回る。
TOOLS   見出し: 海を渡る、6つの相棒。
        6カード(上部に帯バナー画像＋タイトル＋一言＋CTA「島へ渡る」):
        01 音声入力 / 02 SNS発信 / 03 遊牧民ラジオ / 04 アザラシ建設3D /
        05 design-language / 06 オープンデザイン
PROFILE eyebrow: Who is the nomad
        headline: 現場を知る、ひとりのAIビルダー。
STATS   見出し: 小さな自動化が、大きな時間を生む。(数字カウントアップ)
CONTACT/FOOTER  「声をかける」＋ 各ツールへのリンク
```

## 6. すりガラス / カーソル / ギミック
- LiquidGlassCard：backdrop-filter blur ＋ SVG turbulence ＋ 内側ハイライト ＋ 外側グロー。props=blur/shadow/glow/radius。
- GlassButton：SVG変位マップ（base64インライン）＋ hover scale 1.02。
- カスタムカーソル：dot即追従、ring慣性(*.15)、ホバーで珊瑚に拡大。磁石ボタン。カード3Dチルト＋珊瑚グロー。
- 上部スクロール進捗バー、波の仕切り、reveal、画面を泳ぐ白アザラシ。

## 7. デプロイ
- GitHub：**作成済み**（github.com/yubokumin28/yubokumin-lab-site）。push するだけ。
- Netlify：このフォルダをドラッグ＆ドロップ → 公開URL。静的なのでビルド設定不要。
- （Claude Codeに Netlify MCP を繋げば「push してデプロイして」で自動化も可）

---

# 画像プロンプト・パック（遊牧民ラボ版・全アレンジ）

> 共通制約：①アザラシ・人物の「指輪/時計」は描かない（主役のアザラシは別レイヤーのGLB合成。背景bitmapに3Dの主役は描かない）。
> ②配色はモルディブ（ターコイズ/白砂/珊瑚/サン/淡い空）。ネオン・原色赤は禁止。
> ③人物は穏やか、目を閉じるか柔らかい視線。歯を見せた作り笑い禁止。肌は自然（毛穴・質感、AIのツルツル禁止）。
> ④各ショットは「3Dアザラシや文字を置く余白（クリーンな1/3）」を必ず確保。
> ⑤16:9ヒーローは1920x1080以上、2560x1440推奨。
> 使い方：段落版を自宅GPU(ComfyUI/SDXL)や Nano Banana / Imagen 等に貼る。ファイル名は変えない（コードが固定名で読む）。

### 01 ヒーロー背景：夜明けのラグーン（16:9）
`assets/banners/hero-bg.png`
> Cinematic 16:9 hero plate at first light over a Maldives lagoon. Calm turquoise water stretching to the horizon, a single distant overwater bungalow silhouette far on the right edge, soft sandbar in the foreground lower third, sky a smooth gradient from warm blush peach at the horizon through soft coral to powder turquoise at zenith. Gentle ripples catching dawn light, faint mist over the water. Golden-hour sun low behind camera, warm soft key, long soft reflections on the water, color temperature ~4200K. Shot on 35mm at f/5.6, eye-level slightly low, generous clean negative space in the center reserved for a 3D seal composite added later. Photorealistic editorial resort photography, Aman Resort meets Apple keynote, museum-print quality, subtle film grain, lifted blacks, soft contrast. Palette: #eafaf8, #c9f1ee, #4fd3cc, #ffc857, #ff9b76. Aspect 16:9. Negative: no seals, no animals, no jewelry, no people, no text, no logos, no harsh flare, no oversaturation, no fisheye, no HDR halos, no AI plastic smoothing.

### 02 世界観カード：浜辺のリモートワーク（4:5）
`assets/banners/story-card.png`
> Editorial resort lifestyle still, 4:5. A slim unbranded laptop open on a pale wood table on a quiet white-sand terrace, soft morning light, a cup of tea with faint steam, a palm shadow falling across the table, blurred turquoise lagoon in the background bokeh. No people, calm and minimal. Generous negative space top for a headline. Natural textures, no smoothing. Soft window-less daylight, warm bounce, ~5000K. 85mm f/2.8, shallow depth of field. Palette: #f3e9d6, #c9f1ee, #4fd3cc, #ff9b76. Negative: no seals, no jewelry, no logos on laptop, no readable screen text, no people, no neon, no AI plastic look.

### 03 ツール帯バナー（各ツール用・16:9 横長）
各ツールの帯は既存 `assets/shots/banners/*.jpg` をそのまま使う（マイク/スマホ/対談/クレーン/カラー/分析PC）。新規生成する場合は下記テンプレ：
> Premium 16:9 thematic banner for "<ツールの主題>". Calm resort-tinted color grade (turquoise, sand, coral accents), soft cinematic light, a clean third of negative space, no text, no logos. Photorealistic editorial. Palette: lagoon #4fd3cc, sand #f3e9d6, coral #ff7a59. Negative: no seals, no jewelry, no readable text, no neon, no AI plastic.

### 04 プロフィール背景（3:4）
`assets/banners/profile.png`
> Editorial environmental still, 3:4. A calm workspace by a large window overlooking a turquoise sea, ash-wood desk, a closed notebook, a single ceramic cup, soft daylight, white-washed wall, a trailing plant slightly out of focus. No people (the seal mascot is composited separately). Generous negative space right for copy. 50mm f/2.8, lifted blacks. Palette: #f3e9d6, #c9f1ee. Negative: no seals, no people, no logos, no tech clutter, no neon.

### 05 数字セクション背景（21:9）
`assets/banners/stats-bg.png`
> Abstract 21:9 backdrop. Deep lagoon teal gradient (#073b4c to #0b626e) with a very faint horizontal light sweep and subtle paper grain, no focal point, no objects, no text. Designed to host large numbers in a row. Even diffused light, ~5400K. Negative: no text, no logos, no people, no seals, no harsh contrast, no neon, no banding.

---

# ヒーロー動画プロンプト（遊牧民ラボ版・8秒ループ）

`assets/video/hero-loop.mp4`（動画手順STEP4：Google Flow/VEO等で、開始フレーム＝終了フレームを同一指定）
> Loop-ready 16:9 hero video, 8 seconds, 30 fps, LOCKED tripod (no pan, no zoom, no shake). Subject: a calm Maldives lagoon at dawn, gentle turquoise water with slow soft ripples, a distant overwater bungalow silhouette on the far right, soft sandbar in the foreground. Motion lives in the water only: slow gentle ripples and a faint horizontal drift of light mist far in the background, warm dawn rays subtly shifting brightness across the water. Sky holds a steady saturated dawn gradient: warm peach at the horizon, soft coral mid, turquoise to powder blue at zenith. The center 35% stays calm so a 3D seal composite reads cleanly on top. Loop integrity non-negotiable: first and last frame match within 2% pixel diff; any ripple/mist exiting one edge re-enters at the same phase so the loop is invisible. Photorealistic resort cinematography meets Apple keynote opener, subtle film grain post-encode, H.264 8Mbps, 1920x1080 min (2560x1440 preferred). Negatives: no text, no watermark, no logos, no seals, no people, no animals, no birds, no harsh flare, no muddy/pastel grade, no tilt-shift, no fisheye, no HDR halos, no AI smoothing, no sky banding, no camera move, no vertical motion, no flicker, no teleport at loop point, no rain.

軽量化メモ：8秒・1〜2MBに圧縮（H.264/WebM）すれば **Cloudinaryを挟まずNetlify直置きでも軽い**。重い/長尺ならCloudinary。

---

# 画像生成：自宅GPUローカル（第一候補）

旦那様の希望「ナノバナナ級を自宅GPUで」に対する現実解。RTX 5060 Ti(16GB)で十分可能。
- **おすすめ：ComfyUI ＋ SDXL（+ Refiner）or FLUX.1 [dev]**（ローカル・無料・無制限・ネット不要）。
  - 上の段落プロンプトをそのまま positive に、Negative欄に各プロンプトの「Negative:」を入れる。
  - 16:9は 1344x768 / 1536x864 等で生成 → アップスケールで2K。
- **FLUX.1 [dev]** は文字や質感がNano Banana級に強い。16GBでもfp8/ggufで動く。
- できない/重い場合の代替：Google の Nano Banana（Gemini画像）/ Imagen、または Leonardo・Ideogramの無料枠。
- セットアップは私（羊の執事）が手順を用意できます（ComfyUI導入→モデルDL→このプロンプトで一発生成のワークフロー）。

---

# 適用手順（このキットの回し方）
1. （任意）GLB作成：既存アザラシ画像→Meshy無料/Tripo→`assets/models/seal.glb`。無ければ後回しでOK。
2. 画像：自宅GPU(ComfyUI/FLUX or SDXL)で上のプロンプトを生成 → `assets/banners/` へ固定名で保存。
3. 動画：STEP4で8秒ループ → 圧縮 → `assets/video/hero-loop.mp4`。
4. セクション0のワンショットを Claude Code に貼ってサイト生成（素材は上のフォルダを参照させる）。
5. プレビュー確認 → GitHub push → Netlify 公開。
