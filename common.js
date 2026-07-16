const ext = globalThis.browser ?? globalThis.chrome;
const LAUNCH_MODE_KEY = "launchMode";
const HOME_URL_KEY = "homeUrl";
const LAUNCH_MODES = Object.freeze({
  native: "native",
  homepage: "homepage",
  custom: "custom",
});

function isLaunchMode(value) {
  return Object.values(LAUNCH_MODES).includes(value) ? value : LAUNCH_MODES.native;
}

function promisifyStorageCall(method, ...args) {
  if (globalThis.browser) {
    return method(...args);
  }

  return new Promise((resolve, reject) => {
    method(...args, (result) => {
      const error = globalThis.chrome?.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(result);
    });
  });
}

function promisifyCall(method, ...args) {
  if (globalThis.browser) {
    return method(...args);
  }

  return new Promise((resolve, reject) => {
    method(...args, (result) => {
      const error = globalThis.chrome?.runtime?.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(result);
    });
  });
}

function normalizeUrl(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";

  if (value === "about:blank") return value;
  if (/^https?:\/\//i.test(value)) return value;

  try {
    return new URL(`https://${value}`).toString();
  } catch {
    return "";
  }
}

function normalizeHomepageUrl(raw) {
  const value = String(raw ?? "")
    .split("|")
    .map((part) => part.trim())
    .find(Boolean);

  if (!value) return "";
  if (value === "about:blank") return value;
  if (/^about:/i.test(value)) return "";

  return normalizeUrl(value);
}

async function getHomeUrl() {
  const result = await promisifyStorageCall(ext.storage.local.get.bind(ext.storage.local), HOME_URL_KEY);
  return normalizeUrl(result[HOME_URL_KEY]);
}

async function setHomeUrl(raw) {
  const url = normalizeUrl(raw);
  if (!url) {
    await promisifyStorageCall(ext.storage.local.remove.bind(ext.storage.local), HOME_URL_KEY);
    return "";
  }

  await promisifyStorageCall(ext.storage.local.set.bind(ext.storage.local), { [HOME_URL_KEY]: url });
  return url;
}

async function getLaunchMode() {
  const result = await promisifyStorageCall(ext.storage.local.get.bind(ext.storage.local), LAUNCH_MODE_KEY);
  return isLaunchMode(result[LAUNCH_MODE_KEY]);
}

async function setLaunchMode(rawMode) {
  const mode = isLaunchMode(rawMode);
  await promisifyStorageCall(ext.storage.local.set.bind(ext.storage.local), { [LAUNCH_MODE_KEY]: mode });
  return mode;
}

async function getLaunchSettings() {
  const result = await promisifyStorageCall(ext.storage.local.get.bind(ext.storage.local), [
    LAUNCH_MODE_KEY,
    HOME_URL_KEY,
  ]);

  return {
    launchMode: isLaunchMode(result[LAUNCH_MODE_KEY]),
    homeUrl: normalizeUrl(result[HOME_URL_KEY]),
  };
}

async function setLaunchSettings({ launchMode, homeUrl } = {}) {
  const nextMode = isLaunchMode(launchMode);
  const nextHomeUrl = homeUrl === undefined ? await getHomeUrl() : normalizeUrl(homeUrl);

  await promisifyStorageCall(ext.storage.local.set.bind(ext.storage.local), {
    [LAUNCH_MODE_KEY]: nextMode,
    [HOME_URL_KEY]: nextHomeUrl,
  });

  return {
    launchMode: nextMode,
    homeUrl: nextHomeUrl,
  };
}

async function hasBrowserSettingsPermission() {
  if (!ext.permissions?.contains) return false;

  try {
    return await promisifyCall(ext.permissions.contains.bind(ext.permissions), {
      permissions: ["browserSettings"],
    });
  } catch {
    return false;
  }
}

async function requestBrowserSettingsPermission() {
  if (!ext.permissions?.request) return false;

  try {
    return await promisifyCall(ext.permissions.request.bind(ext.permissions), {
      permissions: ["browserSettings"],
    });
  } catch {
    return false;
  }
}

async function getBrowserHomepageUrl() {
  const homepageApi = ext.browserSettings?.homepageOverride;
  if (!homepageApi?.get) return "";

  try {
    const value = String((await homepageApi.get({}))?.value ?? "").trim();
    if (!value) return "";
    return normalizeHomepageUrl(value);
  } catch {
    return "";
  }
}
