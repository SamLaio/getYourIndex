const nativeBtn = document.getElementById("native-btn");
const homeBtn = document.getElementById("home-btn");
const customBtn = document.getElementById("custom-btn");
const customForm = document.getElementById("custom-form");
const customInput = document.getElementById("custom-url");
const clearBtn = document.getElementById("clear-btn");
const status = document.getElementById("status");
const customDesc = document.getElementById("custom-desc");

function getBrowserName() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("chrome") || ua.includes("chromium")) return "chrome";
  return "other";
}

function setStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle("error", Boolean(isError));
}

function getNativeNewTabUrl() {
  return getBrowserName() === "firefox" ? "about:newtab" : "chrome://newtab";
}

async function getBrowserHomepageUrl() {
  const homepageApi = ext.browserSettings?.homepageOverride;
  if (!homepageApi?.get) return "";

  try {
    const value = String((await homepageApi.get({}))?.value ?? "").trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || /^about:/i.test(value)) return value;

    try {
      return new URL(`https://${value}`).toString();
    } catch {
      return "";
    }
  } catch {
    return "";
  }
}

async function openUrl(url) {
  if (!url) {
    setStatus("這個選項目前沒有可開啟的網址。", true);
    return;
  }

  window.location.replace(url);
}

async function loadCustomUrl() {
  const homeUrl = await getHomeUrl();
  customInput.value = homeUrl;
  customDesc.textContent = homeUrl ? `目前設定：${homeUrl}` : "先輸入一個網址，之後就能直接開啟。";
}

nativeBtn.addEventListener("click", async () => {
  setStatus("正在開啟瀏覽器原本的分頁行為...");
  await openUrl(getNativeNewTabUrl());
});

homeBtn.addEventListener("click", async () => {
  setStatus("正在讀取瀏覽器首頁...");

  const granted = await requestBrowserSettingsPermission();
  if (granted) {
    const homepageUrl = await getBrowserHomepageUrl();
    if (homepageUrl) {
      await openUrl(homepageUrl);
      return;
    }
  }

  if (getBrowserName() === "firefox") {
    setStatus("Firefox 沒有回傳可讀取的首頁設定，先開啟 Firefox Home。", true);
    await openUrl("about:home");
    return;
  }

  setStatus("這個瀏覽器目前無法直接讀取首頁設定，請改用自行設定的網址。", true);
});

customBtn.addEventListener("click", async () => {
  const customUrl = normalizeUrl(customInput.value);
  if (customUrl) {
    setStatus(`正在開啟 ${customUrl} ...`);
    await openUrl(customUrl);
    return;
  }

  setStatus("先設定一個網址，再按第三個選項開啟。", true);
  customInput.focus();
});

customForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const saved = await setHomeUrl(customInput.value);
  if (!saved) {
    setStatus("請輸入有效的網址，像是 https://example.com", true);
    return;
  }

  customDesc.textContent = `目前設定：${saved}`;
  setStatus(`已儲存：${saved}`);
});

clearBtn.addEventListener("click", async () => {
  await setHomeUrl("");
  customInput.value = "";
  customDesc.textContent = "先輸入一個網址，之後就能直接開啟。";
  setStatus("已清除自訂網址。");
  customInput.focus();
});

loadCustomUrl();
