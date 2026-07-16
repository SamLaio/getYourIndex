# getYourIndex Store Submission Copy

## Basic Info

- Name: `getYourIndex`
- Version: `0.1`
- Author: `SamLiao`

## Short Description

Configure what happens when a new tab is opened.

## Full Description

`getYourIndex` is a lightweight browser extension for Chrome and Firefox.

It keeps the browser's native new tab flow and lets users choose what happens next from an options page.

Features:

- Keep the browser's native new tab page
- Choose whether to leave new tabs alone, open the browser homepage, or open a saved custom URL
- Open the browser homepage when supported
- Open a custom URL you save locally
- Works in both Chrome and Firefox
- Simple, minimal setup with no extra clutter

How it works:

- Open the extension options page to choose one of three actions
- Save a custom URL locally from the options page
- Firefox can read the browser homepage when the permission is granted
- Chrome keeps the native behavior when browser homepage access is not exposed

## Chrome Web Store Keywords

new tab, homepage, start page, custom homepage, browser extension, chrome extension, firefox extension

## Firefox Add-ons Summary

Choose what happens after a new tab opens: browser default, browser homepage, or your own saved URL.

## Permissions Explanation

- `storage`: used to save your custom URL locally in the browser
- `browserSettings`: used in Firefox to read the browser homepage when the user grants permission

## Build Notes

- Use the Chrome manifest for Chrome distribution.
- Use the Firefox manifest when packaging for Firefox or AMO submission.

## Privacy Note

`getYourIndex` does not collect, transmit, or share personal data.
Custom URLs are stored locally in the browser only.

## Suggested Support Email Line

For support or feedback, contact SamLiao.
