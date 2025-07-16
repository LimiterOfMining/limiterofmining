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
}

// --- Save & Load Data ---
function saveData() {
  if (!currentUser) return;
  db.ref("users/" + currentUser.sub).set({
    money: money
  });
}

function loadData(user) {
  const uid = user.sub;
  db.ref("users/" + uid).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      money = data.money || 0;
    } else {
      money = 0;
    }
    updateUI();
  });
}

// Simpan otomatis saat keluar dari halaman
window.addEventListener("beforeunload", () => {
  saveData();
});

// --- Google Login (Popup) ---
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  currentUser = data;
  alert(`Selamat datang, ${data.name}`);
  if (loginSection) loginSection.classList.add("hidden");
  if (gameSection) gameSection.classList.remove("hidden");
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

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// --- TAP EVENT ---
if (tapBox) {
  tapBox.addEventListener("click", (e) => {
    money += goldPerTap;
    updateUI();
    saveData(); // simpan setelah tap

    if (typeof recordTap === "function") recordTap();

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

if (missionBtn) {
  missionBtn.addEventListener("click", openMissionPopup);
}

// === Tab Switching ===
document.querySelectorAll(".mission-tab").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const tabTarget = tabBtn.getAttribute("data-tab");

    document.querySelectorAll(".tab-content").forEach((tabContent) => {
      tabContent.style.display = "none";
    });

    document.querySelectorAll(".mission-tab").forEach((btn) => {
      btn.classList.remove("active");
    });

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

// Aktifkan tombol jual emas
const sellGoldBtn = document.getElementById("sellGoldBtn");
if (sellGoldBtn) {
  sellGoldBtn.addEventListener("click", openSellPopup);
}
