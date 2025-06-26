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

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = result.user;

    // ✅ Auto set display name dari email jika belum ada
    if (!user.displayName) {
      const defaultName = email.split("@")[0];
      await user.updateProfile({ displayName: defaultName });
    }

    successMessage.textContent = "✅ Login berhasil!";

    setTimeout(() => {
      window.location.href = "beranda.html";
    }, 1000);

  } catch (error) {
    errorMessage.textContent = "❌ Gagal login: " + error.message;
  }
});
