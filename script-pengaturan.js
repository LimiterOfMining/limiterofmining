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
