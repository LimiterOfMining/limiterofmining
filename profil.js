document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  // Nav bawah
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

  if (nameEl) nameEl.textContent = user.name || "No Name";
  if (idEl) idEl.textContent = `ID: ${user.id || "-"}`;
  if (emailEl) emailEl.textContent = `Email: ${user.email || "-"}`;
  if (locationEl) locationEl.textContent = `Lokasi: ${user.country || "-"}, ${user.city || "-"}`;

  // Inisial huruf pertama sebagai avatar jika tidak ada foto
  if (avatarImg) {
    const initial = (user.name?.charAt(0) || "?").toUpperCase();

    // Hapus gambar dan buat huruf
    avatarImg.style.visibility = "hidden";

    // cek kalau sudah ada div avatar sebelumnya
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
