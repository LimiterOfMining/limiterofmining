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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// ✅ Auto redirect jika user sudah login
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("✅ Sudah login:", user.email);
    window.location.href = "beranda.html";
  }
});

// ✅ Login Google
document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    const result = await auth.signInWithRedirect(provider);
    const user = result.user;
    console.log("✅ Login sukses:", user.displayName, user.email);
    window.location.href = "beranda.html";
  } catch (err) {
    console.error("❌ Gagal login Google:", err.message);
    const errorBox = document.getElementById("loginError");
    if (errorBox) {
      errorBox.textContent = "❌ Gagal login Google. Coba lagi.";
      errorBox.classList.remove("hidden");
    }
  }
});
