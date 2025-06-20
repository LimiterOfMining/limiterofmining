const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Elemen
const nameInput = document.getElementById("editName");
const idInput = document.getElementById("editID");
const genderSelect = document.getElementById("genderSelect");
const bioInput = document.getElementById("bioInput");
const form = document.getElementById("editProfileForm");
const photoUpload = document.getElementById("photoUpload");
const photoDisplay = document.getElementById("profile-photo");

auth.onAuthStateChanged((user) => {
  if (!user) {
    alert("⚠️ Silakan login terlebih dahulu.");
    return;
  }

  const uid = user.uid;
  const userRef = db.collection("users").doc(uid);

  // Tampilkan Nama dan ID
  nameInput.value = user.displayName || "Nama Player";
  idInput.value = uid;

  // Ambil data Firestore
  userRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      genderSelect.value = data.gender || "";
      bioInput.value = data.bio || "";
      if (data.photoURL) photoDisplay.src = data.photoURL;

      // Sync localStorage
      localStorage.setItem("profileData", JSON.stringify(data));
    }
  });

  // Upload foto
  photoUpload.addEventListener("change", () => {
    const file = photoUpload.files[0];
    if (!file) return;

    const ref = storage.ref().child(`profilePhotos/${uid}.jpg`);
    ref.put(file).then(() => ref.getDownloadURL())
      .then((url) => {
        photoDisplay.src = url;
        return userRef.set({ photoURL: url }, { merge: true });
      })
      .then(() => {
        const current = JSON.parse(localStorage.getItem("profileData")) || {};
        current.photoURL = photoDisplay.src;
        localStorage.setItem("profileData", JSON.stringify(current));
        alert("✅ Foto profil berhasil diunggah!");
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Gagal upload foto.");
      });
  });

  // Simpan data saat submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      gender: genderSelect.value,
      bio: bioInput.value,
      photoURL: photoDisplay.src
    };

    userRef.set(data, { merge: true })
      .then(() => {
        localStorage.setItem("profileData", JSON.stringify(data));
        alert("✅ Profil berhasil disimpan!");
      })
      .catch(err => {
        console.error(err);
        alert("❌ Gagal menyimpan profil.");
      });
  });
});
