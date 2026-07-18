# getYourIndex 商店上架說明

## 基本資料

- Name: `getYourIndex`
- Version: `0.5`
- Author: `SamLiao`

## 簡短描述

設定開啟新分頁後要執行的動作。

## 完整描述

`getYourIndex` 是一個輕量的 Chrome / Firefox 瀏覽器擴充套件。

它不取代瀏覽器原本的新分頁頁面，而是在新分頁開啟後，依照你在選項頁儲存的設定決定接下來要做什麼。

功能：

- 保留瀏覽器原生的新分頁流程
- 只接管瀏覽器原生新分頁，不接管網頁另開視窗或彈窗
- 接管後會讓焦點落在開啟的網頁，不停在網址列
- 可選擇維持原本動作、開啟瀏覽器首頁（支援時），或開啟自訂網址
- Firefox 可讀取瀏覽器設定的首頁
- Chrome 會隱藏不支援的首頁選項
- 自訂網址只儲存在本機瀏覽器
- 設定簡單，沒有多餘干擾

使用方式：

- 打開擴充套件的選項頁
- 選擇新分頁開啟後要執行的動作
- 若選擇自訂網址，網址會儲存在本機瀏覽器
- Firefox 需要 `browserSettings` 權限才能讀取瀏覽器首頁
- Chrome 沒有對應的首頁讀取 API，因此不會顯示首頁選項

## Chrome Web Store Keywords

new tab, homepage, start page, custom homepage, browser extension, chrome extension, firefox extension

## Firefox Add-ons 摘要

設定 Firefox 開啟新分頁後的動作：維持原本行為、開啟瀏覽器首頁，或開啟你儲存在本機的自訂網址。

## 權限說明

- `storage`：用來在瀏覽器本機儲存自訂網址與選項設定。
- `browserSettings`：Firefox 版用來讀取瀏覽器設定的首頁。

## 打包說明

- Chrome 版請使用 Chrome manifest 打包。
- Firefox / AMO 上架版請使用 Firefox manifest 打包，XPI 會輸出為版本化檔名。

## 隱私說明

`getYourIndex` 不會收集、傳送或分享個人資料。
自訂網址只會儲存在使用者本機瀏覽器。

## 支援聯絡

如需支援或回饋，請聯絡 SamLiao。
