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

let money = 0;
let incomePerTap = 100;
let upgradeCost = 500;

const moneyDisplay = document.getElementById("money");
const incomeDisplay = document.getElementById("income");
const upgradeCostDisplay = document.getElementById("upgrade-cost");
const gameSection = document.getElementById("game-section");
const loginSection = document.getElementById("login-section");

// --- Update UI ---
function updateUI() {
  moneyDisplay.textContent = money;
  incomeDisplay.textContent = incomePerTap;
  upgradeCostDisplay.textContent = upgradeCost;
}

// --- Save & Load Data ---
function saveData() {
  if (!currentUser) return;
  db.ref("users/" + currentUser.sub).set({
    money: money,
    incomePerTap: incomePerTap
  });
}

function loadData(user) {
  const uid = user.sub;
  db.ref("users/" + uid).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      money = data.money || 0;
      incomePerTap = data.incomePerTap || 100;
    } else {
      money = 0;
      incomePerTap = 100;
    }
    updateUI();
  });
}

// --- Button Events ---
document.getElementById("tap-button").addEventListener("click", () => {
  money += incomePerTap;
  updateUI();
  saveData();
});

document.getElementById("upgrade-button").addEventListener("click", () => {
  if (money >= upgradeCost) {
    money -= upgradeCost;
    incomePerTap += 50;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateUI();
    saveData();
  } else {
    alert("Uang belum cukup!");
  }
});

// --- Google Login (Popup) ---
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  currentUser = data;
  alert(`Selamat datang, ${data.name}`);
  loginSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  loadData(currentUser);
  updateUI();
}
