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

// Ambil elemen form
const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("registerEmail");
const passwordInput = document.getElementById("registerPassword");
const repeatInput = document.getElementById("repeatPassword");
const successMessage = document.getElementById("registerSuccess");
const errorMessage = document.getElementById("registerError");

// Sembunyikan pesan
successMessage.classList.add("hidden");
errorMessage.classList.add("hidden");

// Fungsi buat ID acak
function generatePlayerID(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Proses saat form dikirim
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const repeat = repeatInput.value.trim();

  if (password !== repeat) {
    tampilkanError("❌ Password tidak cocok.");
    return;
  }

  if (password.length < 6) {
    tampilkanError("❌ Password minimal 6 karakter.");
    return;
  }

  try {
    // Buat akun
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Buat ID Player
    const playerID = generatePlayerID();

    // Simpan nama & playerID ke displayName
    await user.updateProfile({
      displayName: `${name} | ID: ${playerID}`
    });

    // ✅ Tambahkan data kosong ke Firestore
    await db.collection("users").doc(user.uid).set({
      gender: "",
      bio: "",
      photoURL: ""
    });

    // Kirim verifikasi email
    await user.sendEmailVerification();

    tampilkanSukses(`✅ Akun berhasil dibuat!<br>
    📩 Link verifikasi sudah dikirim ke email.<br>
    🆔 ID Player kamu: <strong>${playerID}</strong>`);

    form.style.display = "none";

  } catch (err) {
    tampilkanError(convertError(err));
  }
});

// Fungsi tampil sukses
function tampilkanSukses(msg) {
  successMessage.innerHTML = msg;
  successMessage.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

// Fungsi tampil error
function tampilkanError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  successMessage.classList.add("hidden");
}

// Fungsi ubah error Firebase ke bahasa manusia
function convertError(err) {
  if (err.code === "auth/email-already-in-use") return "❌ Email sudah digunakan.";
  if (err.code === "auth/invalid-email") return "❌ Format email tidak valid.";
  return "❌ Terjadi kesalahan saat mendaftar.";
}
