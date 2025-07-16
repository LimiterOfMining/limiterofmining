// --- Firebase Config & Init ---
const firebaseConfig = {
  apiKey: "AIzaSyBDOs780kC2SLvU0OLiFWIL5IxISuZRf_w",
  authDomain: "limit-of-trading-inc.firebaseapp.com",
  databaseURL: "https://limit-of-trading-inc-default-rtdb.firebaseio.com",
  projectId: "limit-of-trading-inc",
  storageBucket: "limit-of-trading-inc.firebasestorage.app",
  messagingSenderId: "1029104864288",
  appId: "1:1029104864288:web:d1ebe56e80b8b11fa78045",
  measurementId: "G-5CYRFYWBZ7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentUser = null;

// --- Game Variables ---
let money = 0;
let rupiah = 0;
const goldPerTap = 0.0001;
let upgradeCost = 500;

// --- DOM Elements ---
const moneyDisplay = document.getElementById("money");
const incomeDisplay = document.getElementById("income");
const upgradeCostDisplay = document.getElementById("upgrade-cost");
const gameSection = document.getElementById("game-section");
const loginSection = document.getElementById("login-section");
const tapBox = document.querySelector(".tap-box");
const upgradeButton = document.getElementById("upgrade-button");

// --- Update UI ---
function updateUI() {
  if (moneyDisplay) moneyDisplay.textContent = `🪙 ${money.toFixed(4)}`;
  if (incomeDisplay) incomeDisplay.textContent = `🪙 0.0001 / Tap`;
  if (upgradeCostDisplay) upgradeCostDisplay.textContent = upgradeCost.toLocaleString();

  const rupiahBalance = document.getElementById("rupiahBalance");
  if (rupiahBalance) rupiahBalance.textContent = "Rp " + rupiah.toLocaleString();
}

// --- Save & Load Data ---
function saveData() {
  if (!currentUser) return;
  db.ref("users/" + currentUser.sub).set({
    money: money,
    rupiah: rupiah
  });
}

function loadData(user) {
  const uid = user.sub;
  db.ref("users/" + uid).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      money = data.money || 0;
      rupiah = data.rupiah || 0;
    } else {
      money = 0;
      rupiah = 0;
    }
    updateUI();
  });
}

window.addEventListener("beforeunload", () => {
  saveData();
});

// --- Google Login ---
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  currentUser = data;
  alert(`Selamat datang, ${data.name}`);
  loginSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  loadData(currentUser);
}

// --- BYPASS LOGIN (sementara) ---
if (gameSection) gameSection.classList.remove("hidden");
updateUI();

// --- Ripple Effect ---
function createRipple(x, y) {
  const rippleContainer = tapBox.querySelector(".ripple-container");
  if (!rippleContainer) return;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  rippleContainer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// --- TAP EVENT ---
if (tapBox) {
  tapBox.addEventListener("click", (e) => {
    money += goldPerTap;
    updateUI();
    saveData();
    const rect = tapBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createRipple(x, y);
  });
}

// --- UPGRADE EVENT ---
if (upgradeButton) {
  upgradeButton.addEventListener("click", () => {
    if (money >= upgradeCost / 10000) {
      money -= upgradeCost / 10000;
      updateUI();
      saveData();
    } else {
      alert("Emas belum cukup!");
    }
  });
}

// === Popup Misi ===
const missionBtn = document.getElementById("missionBtn");
const missionPopup = document.getElementById("missionPopup");

function openMissionPopup() {
  missionPopup.classList.remove("hidden");
}
function closeMissionPopup() {
  missionPopup.classList.add("hidden");
}
if (missionBtn) missionBtn.addEventListener("click", openMissionPopup);

// === Tab Switching ===
document.querySelectorAll(".mission-tab").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const tabTarget = tabBtn.getAttribute("data-tab");
    document.querySelectorAll(".tab-content").forEach((c) => c.style.display = "none");
    document.querySelectorAll(".mission-tab").forEach((b) => b.classList.remove("active"));
    const targetTab = document.getElementById("tab-" + tabTarget);
    if (targetTab) {
      targetTab.style.display = "block";
      tabBtn.classList.add("active");
    }
  });
});

// === Popup Jual Emas ===
function openSellPopup() {
  const popup = document.getElementById("sellGoldPopup");
  if (popup) popup.classList.remove("hidden");
}
function closeSellPopup() {
  const popup = document.getElementById("sellGoldPopup");
  if (popup) popup.classList.add("hidden");
}
const sellGoldBtn = document.getElementById("sellGoldBtn");
if (sellGoldBtn) {
  sellGoldBtn.addEventListener("click", openSellPopup);
}

// === PANEL TOKO (Jual Emas) ===
window.addEventListener("DOMContentLoaded", () => {
  const shopBtn = document.getElementById("shopBtn");
  if (shopBtn) shopBtn.addEventListener("click", openShopPanel);
});

function openShopPanel() {
  document.getElementById("goldAmount").textContent = money.toFixed(4);
  document.getElementById("sellInput").value = "";
  document.getElementById("rupiahResult").textContent = "Rp 0";
  document.getElementById("rupiahBalance").textContent = "Rp " + rupiah.toLocaleString();
  document.getElementById("shopPanel").classList.remove("hidden");
}
function closeShopPanel() {
  document.getElementById("shopPanel").classList.add("hidden");
}

function setSellPercentage(percent) {
  const sellAmount = money * (percent / 100);
  document.getElementById("sellInput").value = sellAmount.toFixed(4);
  const result = Math.floor(sellAmount / 0.00004);
  document.getElementById("rupiahResult").textContent = "Rp " + result.toLocaleString();
}

function confirmSellGold() {
  const input = parseFloat(document.getElementById("sellInput").value);
  if (isNaN(input) || input <= 0 || input > money) {
    alert("Jumlah tidak valid.");
    return;
  }
  if (input < 0.5000) {
    alert("Minimal penjualan adalah 0.5000 emas");
    return;
  }

  const gained = Math.floor(input / 0.00004);
  rupiah += gained;
  money -= input;
  updateUI();
  saveData();

  alert(`Berhasil menukar ${input.toFixed(4)} emas menjadi Rp ${gained.toLocaleString()}`);
  closeShopPanel();
}
