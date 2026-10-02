# 研修スライド

Zoomで画面共有して投影する、HTMLの研修資料です。

- `template.html`：型の見本帳。使える部品を一通り並べています
- `ch01_bosai.html`：第1章 防災管理（16枚）
- `assets/deck.css`：見た目（色・文字・部品）
- `assets/deck.js`：ページ送り・段階表示・火の粉・進行メモ

## 使い方

ブラウザでHTMLファイルを開き、全画面にして共有します。

| 操作 | キー |
|---|---|
| 進む | → / Space / Enter / 画面の右側をクリック |
| 戻る | ← / 画面の左側をクリック |
| 全画面 | F |
| 進行メモ（予定時間・経過時間・台本メモ） | N |

N キーの進行メモは画面の上に重ねて表示されるため、共有中は参加者にも見えます。

## 章の作り方

1. `template.html` をコピーして `ch01_防災管理.html` のような名前にする
2. `.deck` の `data-chapter`（フッターの章名）と `data-accent`（章の色）を変える
   - 色の候補：`flame`（既定・オレンジ）、`water`、`green`、`violet`、`gold`、`rose`
3. `<section class="slide">` を、見本から選んで並べる
4. 見本用の青いラベル（`.pattern-tag`）は消す

### スライドに付けられる指定

| 指定 | 意味 |
|---|---|
| `class="slide light"` | 明るい地（ステンレス調） |
| `class="slide glow"` | 下から炎の光が差す地 |
| `class="slide center"` | 中身を上下中央に寄せる |
| `data-embers` | 火の粉を舞わせる（`data-embers="60"` で数を指定） |
| `data-min="3"` | 予定時間（分）。進行メモに表示 |
| `data-no-footer` | フッターは中央のロゴと社名だけを出す（表紙など） |
| 要素に `data-step="1"` | 1回目の操作で表示（2, 3… と続く） |
| `<aside class="notes">` | 進行メモの本文 |

アイコンは `<svg class="i"><use href="#i-fire"/></svg>` の形で使います。名前の一覧は `assets/deck.js` の `ICONS` にあります。
