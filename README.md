# Moodle Quiz Keyboard Navigator

九州大学Moodleのクイズでキーボードによるナビゲーションを可能にする**非公式**Chrome拡張機能です。  
このツールの使用に伴う一切の損害について著者は一切の責任を負いません。  
Macbook Proで動作することを確認しています。その他OSでの動作については保証しません。

## 機能

- **1-4キー**: 選択肢の選択（1番目から4番目の選択肢）
- **矢印キー（↑↓）**: 複数問題がある場合の問題間移動
- **Enterキー**: 次の問題への移動または回答の送信

## インストール方法

1. このページ右上のCode(緑色)を選択し、`Download ZIP`からダウンロードする
2. ダウンロードしたファイルを展開する
3. Chromeブラウザを開き、`chrome://extensions/` にアクセス
4. 右上の「デベロッパーモード」を有効にする
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 展開したフォルダを選択

## 使用方法

1. 九州大学Moodleの各クイズページにアクセス
2. 自動で拡張機能が有効になります
3. キーボードショートカットを使用してクイズを操作

### キーボードショートカット

| キー | 動作 |
|------|------|
| `1` | 1番目の選択肢を選択 |
| `2` | 2番目の選択肢を選択 |
| `3` | 3番目の選択肢を選択 |
| `4` | 4番目の選択肢を選択 |
| `↑` / `↓` | 問題間の移動（複数問題の場合） |
| `Enter` | 次の問題または送信 |

# Moodle Quiz Keyboard Navigator
## About

This is an unofficial Chrome extension that enables keyboard navigation in Kyushu University Moodle quizzes.
The author is not responsible for any damages resulting from the use of this tool.

## Features

- **Keys 1-4**: Select an option (from the first to the fourth option)
- **Arrow Keys (↑↓)**: Move between questions (if there are multiple questions)
- **Enter Key**: Move to the next question or submit the answer

## Installation

1. Choose`Code`(shown green), download with `Download ZIP`
2. Unzip downloaded file
3. Open the Chrome browser and go to `chrome://extensions/`
4. Enable "Developer mode" in the upper right corner
5. Click "Load unpacked"
6. Select unzipped folder

## How to Use

1. Access the quiz page on Kyushu University Moodle
2. The extension will be automatically enabled
3. Use keyboard shortcuts to operate the quiz

### Keyboard Shortcuts

| Key | Action |
|------|------|
| `1` | Select the 1st option |
| `2` | Select the 2nd option |
| `3` | Select the 3rd option |
| `4` | Select the 4th option |
| `↑` / `↓` | Move between questions (if there are multiple questions) |
| `Enter` | Next question or Submit |


## 開発者向け
任意のキーマッピングをしたいときは`content.js`107行目付近を変更すれば変えられます。

## 他大学の方向け
`manifest.json`と`content.js`のドメインの部分を変えればおそらく動作します。（保証はしかねます）
