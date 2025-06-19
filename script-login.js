// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3",
  measurementId: "G-CE1BMD0DJD"
};

// 🔥 Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Cek auto-login → langsung masuk jika sudah login & verifikasi
auth.onAuthStateChanged(user => {
  if (user && user.emailVerified) {
    window.location.href = "beranda.html";
  }
});

// ✅ Ambil elemen HTML
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passInput = document.getElementById("loginPassword");
const successMessage = document.getElementById("loginSuccess");
const errorMessage = document.getElementById("loginError");

// ✅ Event saat form login dikirim
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passInput.value.trim();

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      successMessage.textContent = "✅ Login berhasil! Mengarahkan ke beranda...";
      successMessage.classList.remove("hidden");
      errorMessage.classList.add("hidden");
      setTimeout(() => {
        window.location.href = "beranda.html";
      }, 1000);
    } else {
      tampilkanError("⚠️ Email belum diverifikasi. Silakan cek inbox kamu.");
    }

  } catch (err) {
    tampilkanError("❌ Login gagal. Email atau password salah.");
  }
});

// ✅ Fungsi tampil error
function tampilkanError(pesan) {
  errorMessage.textContent = pesan;
  errorMessage.classList.remove("hidden");
  successMessage.classList.add("hidden");
}
