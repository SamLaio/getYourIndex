if (typeof importScripts === "function") {
  importScripts("common.js");
}

async function updateTabUrl(tabId, targetUrl) {
  if (!targetUrl) return;

  try {
    await promisifyCall(ext.tabs.update.bind(ext.tabs), tabId, { url: targetUrl });
  } catch {
    // Ignore tabs that cannot be redirected.
  }
}

function isNewTabUrl(url) {
  const value = String(url ?? "").trim().toLowerCase();
  return (
    !value ||
    value === "about:blank" ||
    value === "about:newtab" ||
    value.startsWith("chrome://newtab") ||
    value.startsWith("edge://newtab")
  );
}

async function handleNewTab(tabId, url) {
  if (!isNewTabUrl(url)) return;

  const { launchMode, homeUrl } = await getLaunchSettings();
  if (launchMode === LAUNCH_MODES.native) return;

  if (launchMode === LAUNCH_MODES.custom) {
    await updateTabUrl(tabId, homeUrl);
    return;
  }

  if (launchMode === LAUNCH_MODES.homepage) {
    await updateTabUrl(tabId, await getBrowserHomepageUrl());
  }
}

ext.tabs.onCreated.addListener((tab) => {
  handleNewTab(tab.id, tab.url).catch(() => {});
});

ext.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) return;
  handleNewTab(tabId, changeInfo.url).catch(() => {});
});

ext.action?.onClicked?.addListener(() => {
  Promise.resolve(ext.runtime.openOptionsPage?.()).catch(() => {});
});
