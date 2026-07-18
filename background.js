if (typeof importScripts === "function") {
  importScripts("common.js");
}

const redirectedTabIds = new Set();

async function updateTabUrl(tabId, targetUrl) {
  if (!targetUrl) return;

  try {
    await promisifyCall(ext.tabs.update.bind(ext.tabs), tabId, { url: targetUrl });
  } catch {
    // Ignore tabs that cannot be redirected.
  }
}

async function replaceTabUrl(tab, targetUrl) {
  if (!targetUrl) return;

  let created = false;
  try {
    await promisifyCall(ext.tabs.create.bind(ext.tabs), {
      windowId: tab.windowId,
      index: tab.index,
      url: targetUrl,
      active: true,
    });
    created = true;
    await promisifyCall(ext.tabs.remove.bind(ext.tabs), tab.id);
  } catch {
    if (!created) {
      await updateTabUrl(tab.id, targetUrl);
    }
  }
}

async function openOptions() {
  if (ext.runtime.openOptionsPage) {
    try {
      await promisifyCall(ext.runtime.openOptionsPage.bind(ext.runtime));
      return;
    } catch {
      // Fall back to opening the options file directly.
    }
  }

  await promisifyCall(ext.tabs.create.bind(ext.tabs), {
    url: ext.runtime.getURL("options.html"),
  });
}

function isNewTabUrl(url) {
  const value = String(url ?? "").trim().toLowerCase();
  return (
    value === "about:newtab" ||
    value.startsWith("chrome://newtab") ||
    value.startsWith("edge://newtab")
  );
}

async function handleNewTab(tab) {
  if (!tab?.id || !isNewTabUrl(tab.url) || redirectedTabIds.has(tab.id)) return;

  const { launchMode, homeUrl } = await getLaunchSettings();
  if (launchMode === LAUNCH_MODES.native) return;

  redirectedTabIds.add(tab.id);

  if (launchMode === LAUNCH_MODES.custom) {
    await replaceTabUrl(tab, homeUrl);
    return;
  }

  if (launchMode === LAUNCH_MODES.homepage) {
    await replaceTabUrl(tab, await getBrowserHomepageUrl());
  }
}

ext.tabs.onCreated.addListener((tab) => {
  handleNewTab(tab).catch(() => {});
});

ext.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;
  handleNewTab({ ...tab, id: tabId, url: changeInfo.url }).catch(() => {});
});

const actionApi = ext.action ?? ext.browserAction;
actionApi?.onClicked?.addListener(() => {
  openOptions().catch(() => {});
});
