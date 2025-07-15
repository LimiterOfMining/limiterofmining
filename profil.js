document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  // Aktifkan nav bawah
  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Cek login
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Anda belum login!");
    window.location.href = "login.html";
    return;
  }

  // Isi profil
  const nameEl = document.querySelector(".profile-name");
  const idEl = document.querySelector(".profile-id");
  const emailEl = document.querySelector(".profile-email");
  const locationEl = document.querySelector(".profile-location");
  const avatarImg = document.querySelector(".profile-avatar");
  const logoutAvatar = document.querySelector(".account-thumb");

  if (nameEl) nameEl.textContent = user.name || "No Name";
  if (idEl) idEl.textContent = `ID: ${user.id || "-"}`;
  if (emailEl) {
    emailEl.innerHTML = `
      <img src="img/communication.png" alt="email" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">
      ${user.email || "-"}
    `;
  }
  if (locationEl) {
    locationEl.innerHTML = `
      <img src="img/location.png" alt="lokasi" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">
      ${user.country || "-"}, ${user.city || "-"}
    `;
  }

  const initial = (user.name?.charAt(0) || "?").toUpperCase();

  // Avatar besar (kartu profil)
  if (avatarImg) {
    avatarImg.style.visibility = "hidden";

    if (!avatarImg.nextElementSibling || !avatarImg.nextElementSibling.classList.contains("avatar-initial")) {
      avatarImg.insertAdjacentHTML("afterend", `
        <div class="avatar-initial" style="
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: #ffd700;
          color: #000;
          font-size: 36px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;">${initial}</div>`);
    }
  }

  // Avatar kecil (logout)
  if (logoutAvatar) {
    logoutAvatar.style.visibility = "hidden";

    // Hapus jika sudah ada untuk mencegah dobel
    const oldInitial = logoutAvatar.parentElement.querySelector(".logout-avatar-initial");
    if (oldInitial) oldInitial.remove();

    // Sisipkan di dalam flexbox supaya rapi
    const div = document.createElement("div");
    div.className = "logout-avatar-initial";
    div.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ffd700;
      color: #000;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
    `;
    div.textContent = initial;
    logoutAvatar.parentElement.appendChild(div);
  }

  // Logout
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
