document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  // aktifkan nav-item sesuai path
  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // cek user login
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // isi profil dengan data user
  const nameEl = document.querySelector(".profile-name");
  const idEl = document.querySelector(".profile-id");
  const countryImg = document.querySelector(".profile-country img");
  const avatarImg = document.querySelector(".profile-avatar");

  if (nameEl) nameEl.textContent = user.name || "No Name";
  if (idEl) idEl.textContent = `ID: ${user.id || "?"}`;
  if (avatarImg) avatarImg.src = user.picture || "img/avatar.jpg";
  if (countryImg) {
    const locale = (user.locale || "US").split("-").pop().toLowerCase();
    countryImg.src = `https://flagcdn.com/24x18/${locale}.png`;
  }

  // logout
  const logoutBtn = [...document.querySelectorAll(".settings-item span")]
    .find(span => span.textContent.trim().toLowerCase().includes("logout"));

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("playerData");
      window.location.href = "login.html";
    });
  }
});
