const optionsForm = document.getElementById("options-form");
const modeInputs = [...document.querySelectorAll('input[name="launch-mode"]')];
const customWrap = document.getElementById("custom-wrap");
const customInput = document.getElementById("custom-url");
const customSummary = document.getElementById("custom-summary");
const browserNote = document.getElementById("browser-note");
const clearBtn = document.getElementById("clear-btn");
const status = document.getElementById("status");

let savedHomeUrl = "";

function selectedMode() {
  return modeInputs.find((input) => input.checked)?.value ?? LAUNCH_MODES.native;
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", Boolean(isError));
}

function syncCustomVisibility() {
  customWrap.hidden = selectedMode() !== LAUNCH_MODES.custom;
}

function syncCustomSummary(url) {
  customSummary.textContent = url
    ? `目前設定：${url}`
    : "先填入網址，之後新分頁就會直接開啟這裡。";
}

async function syncBrowserNote() {
  const supported = Boolean(ext.browserSettings?.homepageOverride?.get);
  if (supported) {
    const granted = await hasBrowserSettingsPermission();
    browserNote.textContent = granted
      ? "Firefox 可以直接讀取首頁設定。"
      : "Firefox 可以直接讀取首頁設定；如果要用第 2 項，按儲存時請允許 browserSettings 權限。";
    return;
  }

  browserNote.textContent = "Chrome 目前沒有對應的首頁讀取 API，第二個選項在這裡會保留原本行為。";
}

async function loadSettings() {
  const { launchMode, homeUrl } = await getLaunchSettings();
  savedHomeUrl = homeUrl;

  const current = modeInputs.find((input) => input.value === launchMode) ?? modeInputs[0];
  current.checked = true;
  customInput.value = homeUrl;
  syncCustomSummary(homeUrl);
  syncCustomVisibility();
  await syncBrowserNote();
}

modeInputs.forEach((input) => {
  input.addEventListener("change", syncCustomVisibility);
});

customInput.addEventListener("input", () => {
  syncCustomSummary(normalizeUrl(customInput.value));
});

clearBtn.addEventListener("click", async () => {
  customInput.value = "";
  savedHomeUrl = "";
  await setHomeUrl("");
  if (selectedMode() === LAUNCH_MODES.custom) {
    modeInputs[0].checked = true;
    await setLaunchMode(LAUNCH_MODES.native);
    syncCustomVisibility();
    syncCustomSummary("");
    setStatus("已清除自訂網址，並切回原本動作。");
    return;
  }
  syncCustomSummary("");
  setStatus("已清除自訂網址。");
});

optionsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const launchMode = selectedMode();
  let nextHomeUrl = savedHomeUrl;

  if (launchMode === LAUNCH_MODES.custom) {
    nextHomeUrl = normalizeUrl(customInput.value);
    if (!nextHomeUrl) {
      setStatus("請輸入有效網址，例如 https://example.com", true);
      customInput.focus();
      return;
    }
  }

  if (launchMode === LAUNCH_MODES.homepage) {
    if (ext.browserSettings?.homepageOverride?.get) {
      const granted = (await hasBrowserSettingsPermission()) || (await requestBrowserSettingsPermission());
      if (!granted) {
        setStatus("需要 browserSettings 權限才能讀取首頁設定。", true);
        return;
      }
    }
  }

  const saved = await setLaunchSettings({
    launchMode,
    homeUrl: nextHomeUrl,
  });

  savedHomeUrl = saved.homeUrl;
  syncCustomSummary(saved.homeUrl);
  if (launchMode === LAUNCH_MODES.homepage && !ext.browserSettings?.homepageOverride?.get) {
    setStatus("已儲存，但這個瀏覽器沒有讀取首頁的 API，所以按 + 會維持原本行為。");
    return;
  }

  setStatus("已儲存。");
});

loadSettings();
