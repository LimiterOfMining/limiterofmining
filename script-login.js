// ✅ Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3",
  measurementId: "G-CE1BMD0DJD"
};

// ✅ Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Simpan sesi login agar auto-login aktif
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// ✅ Auto-login jika user sudah verifikasi
auth.onAuthStateChanged(user => {
  if (user && user.emailVerified) {
    window.location.href = "beranda.html";
  }
});

// Ambil elemen HTML
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

// Reset tampilan pesan
successMessage.classList.add("hidden");
errorMessage.classList.add("hidden");

// ✅ Event submit form login
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = "Limiter123"; // password tetap agar bisa login ulang

  try {
    // 🔎 Coba login dulu
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      window.location.href = "beranda.html";
    } else {
      await user.sendEmailVerification();
      tampilkanSukses("📩 Email sudah terdaftar tapi belum diverifikasi. Link verifikasi telah dikirim ulang!");
      loginForm.style.display = "none";
    }

  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // 🔨 Buat akun baru
      try {
        const newUser = await auth.createUserWithEmailAndPassword(email, password);
        await newUser.user.sendEmailVerification();
        tampilkanSukses("✅ Akun berhasil dibuat. Link verifikasi dikirim ke email kamu!");
        loginForm.style.display = "none";
      } catch (err) {
        tampilkanErrorCustom(err);
      }
    } else {
      tampilkanErrorCustom(error);
    }
  }
});

// ✅ Fungsi tampil sukses
function tampilkanSukses(pesan) {
  successMessage.textContent = pesan;
  successMessage.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

// ✅ Fungsi tampil error rapi
function tampilkanErrorCustom(err) {
  let msg = "❌ Terjadi kesalahan. Silakan coba lagi.";
  if (err.code === "auth/invalid-email") {
    msg = "❌ Format email tidak valid.";
  } else if (err.code === "auth/email-already-in-use") {
    msg = "❌ Email sudah digunakan. Gunakan email lain.";
  } else if (err.code === "auth/weak-password") {
    msg = "❌ Password terlalu lemah.";
  } else if (err.code === "auth/invalid-login-credentials") {
    msg = "❌ Login gagal. Email atau password salah.";
  }
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  successMessage.classList.add("hidden");
}
