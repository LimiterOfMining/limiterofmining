const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3",
  measurementId: "G-CE1BMD0DJD"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Auto redirect jika user sudah login dan verifikasi
auth.onAuthStateChanged(user => {
  console.log("Auth state changed:", user);
  if (user && user.emailVerified) {
    console.log("âœ… Sudah login dan terverifikasi. Masuk ke beranda...");
    window.location.href = "beranda.html";
  }
});

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passInput = document.getElementById("loginPassword");
const successMessage = document.getElementById("loginSuccess");
const errorMessage = document.getElementById("loginError");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passInput.value.trim();

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Login sukses:", user.email);

    if (user.emailVerified) {
      successMessage.textContent = "âœ… Login berhasil! Mengarahkan ke beranda...";
      successMessage.classList.remove("hidden");
      errorMessage.classList.add("hidden");

      // Delay supaya pesan sempat tampil
      setTimeout(() => {
        window.location.href = "beranda.html";
      }, 1500);

    } else {
      tampilkanError("âš ï¸ Email belum diverifikasi. Silakan cek inbox kamu.");
    }

  } catch (err) {
    console.error("Login error:", err.code, err.message);
    tampilkanError("âŒ Login gagal. Email atau password salah.");
  }
});

function tampilkanError(pesan) {
  errorMessage.textContent = pesan;
  errorMessage.classList.remove("hidden");
  successMessage.classList.add("hidden");
}
