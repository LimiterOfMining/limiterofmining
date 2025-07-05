let money = 0;
let incomePerTap = 100;
let upgradeCost = 500;

const moneyDisplay = document.getElementById("money");
const incomeDisplay = document.getElementById("income");
const upgradeCostDisplay = document.getElementById("upgrade-cost");
const gameSection = document.getElementById("game-section");
const loginSection = document.getElementById("login-section");

document.getElementById("tap-button").addEventListener("click", () => {
  money += incomePerTap;
  updateUI();
});

document.getElementById("upgrade-button").addEventListener("click", () => {
  if (money >= upgradeCost) {
    money -= upgradeCost;
    incomePerTap += 50;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateUI();
  } else {
    alert("Uang belum cukup!");
  }
});

function updateUI() {
  moneyDisplay.textContent = money;
  incomeDisplay.textContent = incomePerTap;
  upgradeCostDisplay.textContent = upgradeCost;
}

// GOOGLE LOGIN
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  alert(`Selamat datang, ${data.name}`);
  loginSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  updateUI(); // ← penting biar tampilan awal langsung muncul
}
