const startButton = document.getElementById('startButton');
const balanceEl = document.getElementById('balance');
const miningDuration = 12 * 60 * 60 * 1000;

let miningStartTime = parseInt(localStorage.getItem('miningStartTime')) || 0;
let miningEndTime = parseInt(localStorage.getItem('miningEndTime')) || 0;
let savedBalance = parseFloat(localStorage.getItem('savedBalance')) || 0;
let miningLevel = parseInt(localStorage.getItem('miningLevel')) || 1;
const maxLevel = 100;

function getRewardByLevel(level) {
  return 0.000000209173528 + 0.00000010 * (level - 1);
}

function getUpgradeCost(level) {
  return getRewardByLevel(level) * 10;
}

function updateUI(currentBalance, remaining) {
  balanceEl.textContent = currentBalance.toFixed(15);
  if (remaining > 0) {
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    document.getElementById('time-info').innerText = `SEDANG MINING: ${h}h ${m}m ${s}s`;
    startButton.disabled = true;
    startButton.textContent = 'SEDANG MENAMBANG';
    startButton.style.background = 'red';
    document.querySelector('.wave').style.opacity = '0.5';
  } else {
    document.getElementById('time-info').innerText = 'Mining ready';
    startButton.disabled = false;
    startButton.textContent = 'START MINING';
    startButton.style.background = '#28a745';
    document.querySelector('.wave').style.opacity = '0';
  }
}

function updateMining() {
  const now = Date.now();
  const reward = getRewardByLevel(miningLevel);

  if (miningEndTime > now) {
    const elapsed = now - miningStartTime;
    const progress = elapsed / miningDuration;
    const current = savedBalance + reward * progress;
    const remain = miningEndTime - now;
    updateUI(current, remain);
    document.getElementById('progress-bar').style.width = (progress * 100) + '%';
  } else if (miningEndTime !== 0) {
    savedBalance += reward;
    localStorage.setItem('savedBalance', savedBalance.toFixed(15));
    miningStartTime = 0;
    miningEndTime = 0;
    localStorage.removeItem('miningStartTime');
    localStorage.removeItem('miningEndTime');
    updateUI(savedBalance, 0);
    document.getElementById('progress-bar').style.width = '100%';
  } else {
    updateUI(savedBalance, 0);
    document.getElementById('progress-bar').style.width = '0%';
  }
}

startButton.addEventListener('click', () => {
  miningStartTime = Date.now();
  miningEndTime = miningStartTime + miningDuration;
  localStorage.setItem('miningStartTime', miningStartTime);
  localStorage.setItem('miningEndTime', miningEndTime);
  updateMining();
});

setInterval(updateMining, 1000);
updateMining();

document.getElementById("upgrade-btn").addEventListener("click", upgradeMiningLevel);

function updateMiningReport() {
  const reward12h = getRewardByLevel(miningLevel);

  document.getElementById('mining-speed').innerText = miningLevel >= maxLevel
    ? `LV ${miningLevel} (MAX)`
    : `LV ${miningLevel} (${miningLevel}x Kecepatan)`;

  document.getElementById('report-1h').innerText = `Perkiraan 1 jam: ${(reward12h / 12).toFixed(15)} LOM`;
  document.getElementById('report-12h').innerText = `Perkiraan 12 jam: ${reward12h.toFixed(15)} LOM`;
  document.getElementById('report-24h').innerText = `Perkiraan 24 jam: ${(reward12h * 2).toFixed(15)} LOM`;

  const percent = Math.min(miningLevel, maxLevel) / maxLevel * 100;
  document.getElementById('speed-bar').style.width = `${percent}%`;

  const upgradeBtn = document.getElementById('upgrade-btn');
  const current = parseFloat(localStorage.getItem('savedBalance')) || 0;

  if (miningLevel >= maxLevel) {
    upgradeBtn.disabled = true;
    upgradeBtn.innerText = 'MAX';
  } else {
    const cost = getUpgradeCost(miningLevel);
    upgradeBtn.disabled = current < cost;
    upgradeBtn.innerText = `Upgrade Level (butuh ${cost.toFixed(15)} LOM)`;
  }
}

function upgradeMiningLevel() {
  let current = parseFloat(localStorage.getItem('savedBalance')) || 0;
  const cost = getUpgradeCost(miningLevel);

  if (current >= cost && miningLevel < maxLevel) {
    miningLevel++;
    current -= cost;
    savedBalance = current;

    localStorage.setItem('miningLevel', miningLevel);
    localStorage.setItem('savedBalance', savedBalance.toFixed(15));

    updateMiningReport();
    updateUI(savedBalance, miningEndTime - Date.now());
  } else {
    alert("Saldo tidak cukup atau sudah MAX");
  }
}

updateMiningReport();

// ========== ABSEN HARIAN ==========
const dailyRewards = [
  0.00000015,
  0.00000017,
  0.00000019,
  0.00000021,
  0.00000023,
  0.00000025,
  0.00000040
];

let dailyDay = parseInt(localStorage.getItem('dailyDay')) || 0;
let lastDailyTimestamp = parseInt(localStorage.getItem('lastDailyTimestamp')) || 0;
let totalCycle = parseInt(localStorage.getItem('dailyCycle')) || 0;
const dailyCooldown = 86400000;

function updateDailyUI() {
  const now = Date.now();
  const remain = dailyCooldown - (now - lastDailyTimestamp);
  const btn = document.getElementById('dailyQuest-btn');
  const currentDay = dailyDay % 7;

  if (remain > 0) {
    btn.disabled = true;
    const h = Math.floor(remain / 3600000);
    const m = Math.floor((remain % 3600000) / 60000);
    document.getElementById('daily-reward-info').innerText = `Tunggu ${h} jam ${m} menit`;
  } else {
    btn.disabled = false;
    document.getElementById('daily-reward-info').innerText =
      `Hari ke-${currentDay + 1}: ${dailyRewards[currentDay].toFixed(9)} LOM`;
  }

  document.getElementById('daily-progress-bar').style.width = `${(currentDay / 7) * 100}%`;
  document.getElementById('dailyQuest-status').innerText = `Siklus selesai: ${totalCycle} kali`;
}

document.getElementById('dailyQuest-btn').addEventListener('click', () => {
  const now = Date.now();
  if (now - lastDailyTimestamp < dailyCooldown) return;

  const currentDay = dailyDay % 7;
  const reward = dailyRewards[currentDay];
  savedBalance += reward;
  dailyDay++;
  lastDailyTimestamp = now;

  if (currentDay === 6) {
    totalCycle++;
    localStorage.setItem('dailyCycle', totalCycle);
  }

  localStorage.setItem('savedBalance', savedBalance.toFixed(15));
  localStorage.setItem('dailyDay', dailyDay);
  localStorage.setItem('lastDailyTimestamp', lastDailyTimestamp);

  document.getElementById('dailyQuest-status').innerText =
    `Absen sukses! Dapat ${reward.toFixed(9)} LOM\nSiklus selesai: ${totalCycle} kali`;

  updateMiningReport();
  updateUI(savedBalance, miningEndTime - Date.now());
  updateDailyUI();
});

updateDailyUI();
setInterval(updateDailyUI, 60000);

// ========== TUGAS SOSIAL MEDIA ==========
function openSocialAndReward(url, rewardAmount, buttonElement) {
  const taskId = 'task_done_' + url;

  if (localStorage.getItem(taskId) === 'true') {
    buttonElement.disabled = true;
    buttonElement.innerText = "Sudah Diklaim";
    buttonElement.classList.remove("unclaimed-button");
    buttonElement.classList.add("claimed-button");
    return;
  }

  window.open(url, '_blank');
  buttonElement.disabled = true;
  buttonElement.innerText = "Verifikasi...";

  setTimeout(() => {
    const confirmed = confirm("Apakah kamu sudah menyelesaikan tugas?");
    if (confirmed) {
      savedBalance += rewardAmount;
      localStorage.setItem("savedBalance", savedBalance.toFixed(15));
      balanceEl.innerText = savedBalance.toFixed(15);
      localStorage.setItem(taskId, 'true');
      buttonElement.innerText = "Sudah Diklaim";
      buttonElement.classList.remove("unclaimed-button");
      buttonElement.classList.add("claimed-button");
      updateMiningReport();
    } else {
      buttonElement.disabled = false;
      buttonElement.innerText = "Ikuti";
      buttonElement.classList.add("unclaimed-button");
    }
  }, 2000);
}

// Saat halaman dimuat, cek semua tombol sosial media
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.task-action button').forEach(button => {
    const onclick = button.getAttribute("onclick");
    if (onclick && onclick.includes("openSocialAndReward")) {
      const match = onclick.match(/openSocialAndReward\('([^']+)'/);
      if (match) {
        const url = match[1];
        const taskId = 'task_done_' + url;
        if (localStorage.getItem(taskId) === 'true') {
          button.disabled = true;
          button.innerText = "Sudah Diklaim";
          button.classList.add("claimed-button");
        } else {
          button.disabled = false;
          button.innerText = "Ikuti";
          button.classList.add("unclaimed-button");
        }
      }
    }
  });
});

// cahaya navigasi
const navLinks = document.querySelectorAll('.bottom-nav a');
const currentPath = window.location.pathname;

navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPath.split('/').pop()) {
    link.classList.add('active');
  }
});

// Animasi Bintang //
const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];

  // Generate 200 bintang acak (posisi, ukuran, kecepatan)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 1.5 + 0.5;
    const speed = Math.random() * 0.3 + 0.1;
    stars.push({ x, y, r, speed });
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let s of stars) {
      s.y -= s.speed;
      if (s.y < 0) {
        s.y = canvas.height + Math.random() * 50;
        s.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    requestAnimationFrame(animateStars);
  }

  animateStars();
