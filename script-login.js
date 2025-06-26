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

// ✅ Ambil hasil redirect login Google
auth.getRedirectResult()
  .then((result) => {
    if (result.user) {
      console.log("✅ Login redirect sukses:", result.user.email);
      window.location.href = "beranda.html";
    }
  })
  .catch((error) => {
    console.error("❌ Redirect error:", error.message);
    const errorBox = document.getElementById("loginError");
    if (errorBox) {
      errorBox.textContent = "❌ Gagal login Google. " + error.message;
      errorBox.classList.remove("hidden");
    }
  });

// ✅ Tombol Login Google
document.getElementById("googleLogin").addEventListener("click", () => {
  auth.signInWithRedirect(provider);
});
