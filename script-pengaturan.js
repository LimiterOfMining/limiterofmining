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
  if (user) {
    const nameAndID = user.displayName || "Player | ID123456";
    const [name, idRaw] = nameAndID.split(" | ID:");
    const id = idRaw || "ID000000";

    // Tampilkan nama dan ID
    document.getElementById("player-name").textContent = name;
    document.getElementById("player-id").textContent = "ID: " + id;

    const nameInput = document.getElementById("editName");
    const idInput = document.getElementById("editID");

    if (nameInput && idInput) {
      nameInput.value = name;
      idInput.value = id;
    }

    // 🔄 Ambil data profil dari Firestore
    const userRef = db.collection("users").doc(user.uid);
    userRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        // GENDER & BIO
        if (document.getElementById("genderSelect"))
          document.getElementById("genderSelect").value = data.gender || localStorage.getItem("gender") || "";
        if (document.getElementById("bioInput"))
          document.getElementById("bioInput").value = data.bio || localStorage.getItem("bio") || "";

        // FOTO PROFIL
        const profilePhotoURL = data.photoURL || localStorage.getItem("profile-photo") || "default-profile.png";
        document.getElementById("profile-photo").src = profilePhotoURL;
      } else {
        // Gunakan localStorage jika belum ada data Firestore
        document.getElementById("profile-photo").src = localStorage.getItem("profile-photo") || "default-profile.png";
      }
    });

    // 🎯 Tampilkan form edit jika tombol diklik
    const editBtn = document.getElementById("edit-profile-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        document.getElementById("profile-edit-section").classList.remove("hidden");
      });
    }

    // ✅ Simpan perubahan profil
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const gender = document.getElementById("genderSelect").value;
        const bio = document.getElementById("bioInput").value;

        // Simpan ke localStorage
        localStorage.setItem("gender", gender);
        localStorage.setItem("bio", bio);

        // Simpan ke Firestore
        db.collection("users").doc(user.uid).set({ gender, bio }, { merge: true })
          .then(() => alert("✅ Profil berhasil disimpan!"))
          .catch((err) => console.error("Gagal simpan Firestore:", err));
      });
    }

    // ✅ Upload Foto Profil → simpan ke Storage + Firestore
    const photoInput = document.getElementById("photoUpload");
    if (photoInput) {
      photoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const storageRef = storage.ref(`profilePhotos/${user.uid}.jpg`);
        storageRef.put(file).then(() => {
          return storageRef.getDownloadURL();
        }).then((url) => {
          // Tampilkan & simpan
          document.getElementById("profile-photo").src = url;
          localStorage.setItem("profile-photo", url);
          return db.collection("users").doc(user.uid).set({ photoURL: url }, { merge: true });
        }).then(() => {
          alert("📸 Foto profil berhasil diupload!");
        }).catch((err) => {
          console.error("Upload gagal:", err);
          alert("⚠️ Gagal upload foto.");
        });
      });
    }

  } else {
    alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
    window.location.href = "index.html";
  }
});
