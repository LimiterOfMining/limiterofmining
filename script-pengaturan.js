// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3"
};

// 🔥 Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 🔄 Saat user login
auth.onAuthStateChanged(user => {
  if (user) {
    const nameAndID = user.displayName || "Player | ID123456";
    const [name, idRaw] = nameAndID.split(" | ID:");
    const id = idRaw || "ID000000";

    // Tampilkan nama dan ID
    document.getElementById("player-name").textContent = name;
    document.getElementById("player-id").textContent = "ID: " + id;

    document.getElementById("editName").value = name;
    document.getElementById("editID").value = id;

    // Tampilkan foto profil
    const savedPhoto = localStorage.getItem("profile-photo");
    const profilePhoto = savedPhoto || user.photoURL || "default-profile.png";
    document.getElementById("profile-photo").src = profilePhoto;

    // Tampilkan data lokal jika ada
    document.getElementById("genderSelect").value = localStorage.getItem("gender") || "";
    document.getElementById("bioInput").value = localStorage.getItem("bio") || "";
  } else {
    alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "index.html";
  }
});

// 🎯 Tombol tampilkan form
document.getElementById("edit-profile-btn").addEventListener("click", () => {
  document.getElementById("profile-edit-section").classList.remove("hidden");
});

// ✅ Simpan perubahan
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const gender = document.getElementById("genderSelect").value;
  const bio = document.getElementById("bioInput").value;

  // Simpan ke localStorage
  localStorage.setItem("gender", gender);
  localStorage.setItem("bio", bio);

  alert("✅ Profil berhasil disimpan!");
});

// ✅ Upload foto profil
document.getElementById("photoUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageURL = e.target.result;
    document.getElementById("profile-photo").src = imageURL;
    localStorage.setItem("profile-photo", imageURL);
  };
  reader.readAsDataURL(file);
});

/// Animasi Background Bintang ///
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
