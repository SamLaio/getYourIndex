const optionsForm = document.getElementById("options-form");
const modeInputs = [...document.querySelectorAll('input[name="launch-mode"]')];
const homepageInput = document.getElementById("mode-homepage");
const homepageChoice = document.querySelector('label[for="mode-homepage"]');
const customWrap = document.getElementById("custom-wrap");
const customInput = document.getElementById("custom-url");
const customIndex = document.querySelector('label[for="mode-custom"] .choice-index');
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

function supportsHomepageMode() {
  return Boolean(ext.browserSettings?.homepageOverride?.get);
}

function syncHomepageAvailability() {
  const supported = supportsHomepageMode();
  homepageInput.hidden = !supported;
  homepageInput.disabled = !supported;
  homepageChoice.hidden = !supported;
  customIndex.textContent = supported ? "3" : "2";
}

async function syncBrowserNote() {
  const supported = supportsHomepageMode();
  if (supported) {
    const granted = await hasBrowserSettingsPermission();
    browserNote.textContent = granted
      ? "Firefox 可以直接讀取首頁設定。"
      : "Firefox 可以直接讀取首頁設定；如果要用首頁選項，按儲存時請允許 browserSettings 權限。";
    return;
  }

  browserNote.textContent = "這個瀏覽器沒有可讀取首頁的 API，所以只提供原本動作與自訂網址。";
}

async function loadSettings() {
  syncHomepageAvailability();

  let { launchMode, homeUrl } = await getLaunchSettings();
  savedHomeUrl = homeUrl;

  if (launchMode === LAUNCH_MODES.homepage && !supportsHomepageMode()) {
    launchMode = await setLaunchMode(LAUNCH_MODES.native);
  }

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
    if (!supportsHomepageMode()) {
      setStatus("這個瀏覽器無法讀取首頁設定，請改用自訂網址。", true);
      return;
    }

    const granted = (await hasBrowserSettingsPermission()) || (await requestBrowserSettingsPermission());
    if (!granted) {
      setStatus("需要 browserSettings 權限才能讀取首頁設定。", true);
      return;
    }
  }

  const saved = await setLaunchSettings({
    launchMode,
    homeUrl: nextHomeUrl,
  });

  savedHomeUrl = saved.homeUrl;
  syncCustomSummary(saved.homeUrl);
  setStatus("已儲存。");
});

loadSettings();
