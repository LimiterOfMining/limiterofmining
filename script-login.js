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

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.sendEmailVerification();
    })
    .then(() => {
      successMessage.textContent = "✅ Link verifikasi sudah dikirim ke email kamu. Silakan cek inbox atau folder spam.";
      successMessage.classList.remove('hidden');
      errorMessage.classList.add('hidden');
      loginForm.style.display = 'none';
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            if (!userCredential.user.emailVerified) {
              return userCredential.user.sendEmailVerification();
            } else {
              successMessage.textContent = "✅ Email sudah diverifikasi. Silakan lanjut ke game.";
              successMessage.classList.remove('hidden');
              errorMessage.classList.add('hidden');
            }
          })
          .then(() => {
            successMessage.textContent = "✅ Link verifikasi dikirim ulang ke email kamu. Silakan cek inbox atau spam.";
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            loginForm.style.display = 'none';
          })
          .catch((err) => {
            tampilkanErrorCustom(err);
          });
      } else {
        tampilkanErrorCustom(error);
      }
    });
});

// Fungsi untuk menampilkan pesan error yang rapi
function tampilkanErrorCustom(err) {
  if (err.code === 'auth/invalid-login-credentials') {
    errorMessage.textContent = "❌ Email atau password salah. Silakan periksa kembali.";
  } else if (err.code === 'auth/invalid-email') {
    errorMessage.textContent = "❌ Format email tidak valid. Mohon cek kembali.";
  } else if (err.code === 'auth/weak-password') {
    errorMessage.textContent = "❌ Password terlalu lemah. Gunakan kombinasi angka dan huruf.";
  } else {
    errorMessage.textContent = "❌ Terjadi kesalahan. Silakan coba lagi.";
  }
  errorMessage.classList.remove('hidden');
}
