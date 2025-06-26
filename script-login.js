// Inisialisasi Firebase
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
const db = firebase.firestore();

// Fungsi login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Ambil data user dari Firestore
      return db.collection("users").doc(user.uid).get();
    })
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        
        // Simpan ke localStorage
        localStorage.setItem("uid", doc.id);
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("nama", data.nama || "Player");
        localStorage.setItem("bio", data.bio || "");
        localStorage.setItem("gender", data.gender || "");
        localStorage.setItem("foto", data.foto || "");

        // Arahkan ke beranda
        window.location.href = "beranda.html";
      } else {
        alert("Data pengguna tidak ditemukan.");
      }
    })
    .catch((error) => {
      console.error("Login gagal:", error);
      alert("Email atau Password salah.");
    });
});
