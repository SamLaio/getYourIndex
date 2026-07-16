const popupForm = document.getElementById("popup-form");
const popupInput = document.getElementById("popup-url");
const popupClearBtn = document.getElementById("clear-btn");
const status = document.getElementById("status");

async function loadPopupValue() {
  const url = await getHomeUrl();
  popupInput.value = url;
  status.textContent = url ? `目前自訂網址：${url}` : "尚未設定自訂網址。";
}

popupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const saved = await setHomeUrl(popupInput.value);

  if (!saved) {
    status.textContent = "請輸入有效網址。";
    status.classList.add("error");
    return;
  }

  status.classList.remove("error");
  status.textContent = `已儲存：${saved}`;
});

popupClearBtn.addEventListener("click", async () => {
  await setHomeUrl("");
  popupInput.value = "";
  status.classList.remove("error");
  status.textContent = "已清除自訂網址。";
});

loadPopupValue();
