// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBps3E-x059gTZ9lblJaaC5R3n9wd2-hrY",
  authDomain: "limiterofmining-69272.firebaseapp.com",
  projectId: "limiterofmining-69272",
  storageBucket: "limiterofmining-69272.appspot.com",
  messagingSenderId: "69089394090",
  appId: "1:69089394090:web:ee3e3ab8bd806574067fd3"
};

// 🔥 Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// 🔄 Saat user login
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const userRef = db.collection("users").doc(uid);

  // Tampilkan nama dan ID dari Firebase Auth
  const name = user.displayName || "Nama Player";
  document.getElementById("player-name").textContent = name;
  document.getElementById("player-id").textContent = "ID: " + uid;

  // Tampilkan di input kalau ada form
  const nameInput = document.getElementById("editName");
  const idInput = document.getElementById("editID");
  if (nameInput && idInput) {
    nameInput.value = name;
    idInput.value = uid;
  }

  // Ambil data dari Firestore
  userRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data.gender && document.getElementById("genderSelect"))
        document.getElementById("genderSelect").value = data.gender;

      if (data.bio && document.getElementById("bioInput"))
        document.getElementById("bioInput").value = data.bio;

      if (data.photoURL && document.getElementById("profile-photo"))
        document.getElementById("profile-photo").src = data.photoURL;

      // Simpan sementara ke localStorage
      localStorage.setItem("profileData", JSON.stringify(data));
    }
  });

  // 🔘 Tombol Lihat Profil atau Edit Profil
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      document.getElementById("profile-edit-section").classList.remove("hidden");
    });
  }

  // 📥 Upload foto profil
  const photoInput = document.getElementById("photoUpload");
  if (photoInput) {
    photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      const storageRef = storage.ref(`profilePhotos/${uid}.jpg`);
      storageRef.put(file).then(() => storageRef.getDownloadURL())
        .then((url) => {
          if (document.getElementById("profile-photo"))
            document.getElementById("profile-photo").src = url;

          localStorage.setItem("profile-photo", url);
          return userRef.set({ photoURL: url }, { merge: true });
        })
        .then(() => alert("✅ Foto profil berhasil diunggah!"))
        .catch((err) => {
          console.error("Upload gagal:", err);
          alert("❌ Gagal upload foto.");
        });
    });
  }

  // 💾 Simpan perubahan biodata dan gender
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const gender = document.getElementById("genderSelect").value;
      const bio = document.getElementById("bioInput").value;
      const photoURL = document.getElementById("profile-photo")?.src || "";

      const data = { gender, bio, photoURL };
      db.collection("users").doc(uid).set(data, { merge: true })
        .then(() => {
          localStorage.setItem("profileData", JSON.stringify(data));
          alert("✅ Profil berhasil disimpan!");
        })
        .catch((err) => {
          console.error("Gagal simpan Firestore:", err);
          alert("❌ Gagal menyimpan profil.");
        });
    });
  }
});
