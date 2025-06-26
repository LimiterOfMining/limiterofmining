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

// 🧩 Ambil elemen form
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const loginSuccess = document.getElementById("loginSuccess");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loginSuccess.classList.add("hidden");
  loginError.classList.add("hidden");

  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Set displayName jika belum ada
      if (!user.displayName) {
        const defaultName = email.split("@")[0];
        return user.updateProfile({ displayName: defaultName }).then(() => user);
      }
      return user;
    })
    .then(() => {
      loginSuccess.textContent = "✅ Login berhasil! Mengarahkan...";
      loginSuccess.classList.remove("hidden");

      setTimeout(() => {
        window.location.href = "beranda.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      loginError.textContent = "❌ Email atau password salah.";
      loginError.classList.remove("hidden");
    });
});
