# AI実行用レシピ：AI製 3Dプロダクト ウェブサイト制作

> 出典: YouTube「I Built a $5,000 AI Health Ring Website in 10 Minutes」(Shreyas Raj, https://youtu.be/sQoqCl3700I)
> 配布プロンプト集: https://docs.google.com/document/d/17yaHtrP9n-_f-9kc9ljEqgycRswjAqSkU0ifHI8O38g/edit
> このファイルは「AI(私)が手順を実行する」ための構造化版。人間向けの読みやすい版は `build-guide.html`。

## 目的
商品を主役にした高級感ある3D LPを、AI素材生成＋AI組み立てで短時間・低コストで作り、公開する。

## 成果物の構成（標準）
- ヒーロー: 8秒ループ動画(背景) ＋ 中央に3Dモデル(GLB, model-viewer/Spline)
- 以降: 16:9のプレミアム画像セクションが続く
- 公開: GitHub push → Netlify デプロイ

## 並行処理の原則（重要）
STEP1(土台ビルド)を走らせている裏で、STEP2-5(素材生成)を進める。素材が揃ったらSTEP6で合流。

---

## STEP 0 — 参考収集
- 入力: 作りたい商品/テーマ
- 操作: Pinterest / Dribbble / Landbook で「<商品> website」検索
- 出力: **参考画像1枚**（STEP2の3D生成の元画像になる）

## STEP 1 — サイト土台を並行ビルド
- ツール: Claude Code（無料代替: Google Antigravity IDE）
- 操作: 「ワンショット構築プロンプト」を貼る → model=sonnet → 実行（裏で走らせ続ける）
- 出力: サイトの骨格（素材は後で差し込む前提）

## STEP 2 — 3Dモデル生成（GLB）
- ツール: Meshy AI（無料代替: Tripo / Meshy無料枠 "Meshy 5"）
- 操作: STEP0の参考画像 → image-to-3D 生成 → **HD texture** 適用 → **GLB** で download
- 出力: `model.glb`（Web最適形式）
- 注意: GLB一択（ブラウザ/モバイルで最軽量・最滑らか）

## STEP 3 — 画像素材生成（16:9）
- ツール: Magnific / ChatGPT画像（無料代替: Google Flow + Nano Banana Pro）
- 操作: 配布プロンプト(背景/ライフスタイル)を使用 → **aspect 16:9** → 各テーマ4枚
- 出力: 高解像度画像 複数（多いほどLPが豪華に）

## STEP 4 — ヒーロー動画（8秒ループ）
- ツール: Google Flow / VEO 3.1 light（無料代替: Nano Banana Pro 動画）
- 操作: STEP3の1枚を **start frame = end frame に同一指定** → 8秒ループ生成
- 出力: `hero-loop.mp4`（継ぎ目なくループ）

## STEP 5 — 動画ホスティング
- ツール: Cloudinary（無料・Gmail登録）
- 操作: mp4 をアップ → streaming URL を取得
- 出力: 動画URL（サイトに直接埋め込まない＝ロード爆速対策）

## STEP 6 — 組み立て（AIに依頼）
- 前提: 画像を1フォルダにまとめる（例 `ring-assets/`）
- Claude Codeへの指示テンプレ:
  ```
  ・画像はこのフォルダを使う: <フォルダ絶対パス>
  ・3DモデルはこのGLBを使う: <GLB絶対パス>
  ・ヒーロー動画はこのURLを使う: <Cloudinary URL>
  ・表示崩れ/見栄えをテストしてから渡す
  ```

## STEP 7 — 公開
- ツール: Claude Code + GitHub MCP + Netlify MCP
- 操作: 各MCPを接続(認証)→「GitHubにpush & Netlifyにデプロイ & 公開URLをくれ」
- 出力: 本番URL（ターミナル不要）

---

## 遊牧民ラボ向けアレンジ（置き換え表）
| 動画 | 遊牧民ラボ版 |
|---|---|
| 健康リング(主役3D) | アザラシ or 各ツールを象徴する小物（既存Splineアザラシ継続も可） |
| 参考検索ワード | "product landing page 3D" / "resort web design" |
| 配色 | モルディブ固定: ラグーン#129ca0 / サンド#f3e9d6 / 珊瑚#ff7a59 / サン#ffc857 |
| ヒーロー動画 | 波が揺れる8秒ループ |
| 構築プロンプト | 遊牧民ラボ規約(ブランド/配色/フォント/Lenis+GSAP/a11y)を固定したテンプレ |

## 羊の執事の改善案（採用は旦那様判断）
1. 3D表示は Google製 `<model-viewer>`（無料・透かし無し・軽量）でGLBを出す。
2. 画像は自宅GPU(RTX 5060 Ti)で ComfyUI/SDXL ローカル生成も可（無料・無制限）。
3. 短い軽量ループ動画はCloudinary不要、Netlify直置きでも可（依存削減）。重い/長尺はCloudinary。
4. 「ワンショット構築プロンプト」を遊牧民ラボ専用テンプレに資産化→2本目以降を高速量産。
5. GitHubは作成済み→Netlify接続のみで自動デプロイ導線が完成。

## 実行フラグ（人間に確認すべき分岐）
- [ ] 3D: Meshyで新規 / 既存Splineアザラシ流用 ?
- [ ] 画像: 自宅GPUローカル / Google Flow無料 / Magnific有料 ?
- [ ] 動画ホスト: Netlify直置き / Cloudinary ?
- [ ] 最初に作るツール1本はどれ ?
