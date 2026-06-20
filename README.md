# 遊牧民ラボ — Yubokumin Lab (Portfolio Site)

建設×AI自動化を独学で進める個人事業主「遊牧民」の、自作AIツール実績ポートフォリオサイト。

## このリポジトリについて
- スマホからでも引き継げるよう、GitHub に集約したプロジェクトです。
- 別の端末/セッションで続きをやる場合は `git clone` して作業し、`git push` で戻してください。
- **現状はv1（初版）の引き継ぎ**です。これから動画の手順を元に作り直し（v2）を行います。

## 世界観 / デザイン
- ブランド: 遊牧民ラボ。主役マスコット=インディアン風アザラシ。画面を白いアザラシが泳ぐ演出。
- 配色: モルディブのリゾート（ラグーン/サンド/珊瑚/サン）。
- ヒーロー3D: Spline の水・リゾートシーン（`https://prod.spline.design/7PA5QTpluER3HI-s/scene.splinecode`）。

## 構成（v1）
```
index.html            ハブ（ヒーロー / ツール6カード / 世界観 / プロフィール / 実績 / フッター）
tools/                個別LP6本（voice / sns / radio / construction / design-kit / open-design）
css/                  tokens(配色) / base / components / animations / hero / lp
js/                   core(基礎演出) / smooth(Lenis+GSAP) / cursor / spline-hero / lp
assets/
  seal/               旧アザラシ素材
  seal-new/           可愛い白アザラシ(study/peek/logo/empty)
  swimming.png        画面を泳ぐアザラシ
  chars/              遊牧民/秘書
  shots/              各ツールの実画面スクショ
  shots/banners/      カード上部の帯状画像(無料素材)
  svg/                予備
  video/              ラジオ生成動画サンプル
```

## 技術（v1）
- ビルド不要の静的サイト（HTML/CSS/JS）。
- Lenis（慣性スクロール）+ GSAP/ScrollTrigger（ピン留め横スクロール・カウントアップ）を CDN 読み込み。
- ローカル確認: `python -m http.server 8000` などで配信。

## ローカルで見る
```
cd このフォルダ
python -m http.server 8000
```
→ ブラウザで http://localhost:8000

## これからの予定（v2 / 動画ベースの作り直し）
- 参照動画: https://youtu.be/sQoqCl3700I
- 動画手順の日本語整理（HTML）と、ツール制作ガイドを別途用意して進める。
