function getPlayerOnlineCount() {
  const now = new Date();
  const hour = now.getHours();
  let min = 2618;
  let max = 11289;

  if (hour >= 0 && hour < 6) {
    min = 2618;
    max = 4378;
  } else if (hour >= 6 && hour < 12) {
    min = 4378;
    max = 11289;
  } else {
    min = 4378;
    max = 11289;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPlayerMiningCount() {
  // Selisih logika jam dengan player online
  const now = new Date();
  let fakeHour = (now.getHours() + 2) % 24;
  let min = 2618;
  let max = 11289;

  if (fakeHour >= 0 && fakeHour < 6) {
    min = 2618;
    max = 4378;
  } else if (fakeHour >= 6 && fakeHour < 12) {
    min = 4378;
    max = 11289;
  } else {
    min = 4378;
    max = 11289;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let playerLoginCount = 16849;

function updateStatusCounts() {
  const onlineCount = getPlayerOnlineCount();
  const miningCount = getPlayerMiningCount();

  document.getElementById("player-online-count").textContent = onlineCount;
  document.getElementById("player-mining-count").textContent = miningCount;
  document.getElementById("player-login-count").textContent = playerLoginCount;
}

// Update setiap 3-5 detik biar terasa real-time naik turun
setInterval(updateStatusCounts, 6000);

// Jalankan pertama kali
updateStatusCounts();
