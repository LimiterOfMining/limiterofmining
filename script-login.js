// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3",
  measurementId: "G-CE1BMD0DJD"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginForm = document.getElementById('loginForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = Math.random().toString(36).slice(-8); // password random

  // Coba buat user baru
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.sendEmailVerification();
    })
    .then(() => {
      successMessage.textContent = "✅ Email verifikasi sudah dikirim. Silakan cek inbox kamu.";
      successMessage.classList.remove('hidden');
      errorMessage.classList.add('hidden');
      loginForm.style.display = 'none';
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        // Kalau email sudah dipakai, coba login dan kirim ulang verifikasi
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            if (!userCredential.user.emailVerified) {
              return userCredential.user.sendEmailVerification().then(() => {
                successMessage.textContent = "✅ Email sudah terdaftar, link verifikasi baru sudah dikirim!";
                successMessage.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                loginForm.style.display = 'none';
              });
            } else {
              successMessage.textContent = "✅ Email ini sudah diverifikasi. Silakan lanjut ke game.";
              successMessage.classList.remove('hidden');
              errorMessage.classList.add('hidden');
            }
          })
          .catch((err) => {
            errorMessage.textContent = `❌ Gagal login: ${err.message}`;
            errorMessage.classList.remove('hidden');
          });
      } else if (error.code === 'auth/invalid-email') {
        errorMessage.textContent = "❌ Format email tidak valid.";
        errorMessage.classList.remove('hidden');
      } else {
        errorMessage.textContent = `❌ ${error.message}`;
        errorMessage.classList.remove('hidden');
      }
    });
});
