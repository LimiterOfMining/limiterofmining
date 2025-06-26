// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  // ✅ Tampilkan data user Google
  const name = user.displayName || "Tidak ada nama";
  const email = user.email || "Tidak tersedia";
  const uid = user.uid;
  const photo = user.photoURL || "default-profile.png";

  // 🖼️ Elemen HTML yang wajib ada di pengaturan.html
  const nameBox = document.getElementById("player-name");
  const idBox = document.getElementById("player-id");
  const emailBox = document.getElementById("player-email");
  const photoImg = document.getElementById("profile-photo");

  if (nameBox) nameBox.textContent = name;
  if (idBox) idBox.textContent = "ID: " + uid;
  if (emailBox) emailBox.textContent = email;
  if (photoImg) photoImg.src = photo;
});
