const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const nameInput = document.getElementById("editName");
const idInput = document.getElementById("editID");
const genderSelect = document.getElementById("genderSelect");
const bioInput = document.getElementById("bioInput");
const form = document.getElementById("editProfileForm");
const photoUpload = document.getElementById("photoUpload");
const photoDisplay = document.getElementById("profile-photo");

// --- Tampilkan data dari localStorage dulu ---
const localData = JSON.parse(localStorage.getItem("profileData")) || {};
genderSelect.value = localData.gender || "";
bioInput.value = localData.bio || "";
if (localData.photoURL) photoDisplay.src = localData.photoURL;

auth.onAuthStateChanged((user) => {
  if (user) {
    const userRef = db.collection("users").doc(user.uid);

    nameInput.value = user.displayName || "Nama Player";
    idInput.value = user.uid || "ID123456";

    // Ambil data dari Firestore
    userRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        genderSelect.value = data.gender || "";
        bioInput.value = data.bio || "";
        if (data.photoURL) photoDisplay.src = data.photoURL;

        // Sync ke localStorage
        localStorage.setItem("profileData", JSON.stringify({
          gender: data.gender || "",
          bio: data.bio || "",
          photoURL: data.photoURL || ""
        }));
      }
    });

    // Upload foto otomatis saat dipilih
    photoUpload.addEventListener("change", function () {
      const file = photoUpload.files[0];
      if (!file) return;

      const storageRef = storage.ref().child(`profilePhotos/${user.uid}.jpg`);
      storageRef.put(file).then(() => {
        return storageRef.getDownloadURL();
      }).then((url) => {
        photoDisplay.src = url;

        // Simpan ke Firestore
        return userRef.set({ photoURL: url }, { merge: true });
      }).then(() => {
        // Simpan ke localStorage
        const updated = JSON.parse(localStorage.getItem("profileData")) || {};
        updated.photoURL = photoDisplay.src;
        localStorage.setItem("profileData", JSON.stringify(updated));
        alert("Foto profil berhasil diunggah!");
      }).catch((error) => {
        console.error("Upload gagal:", error);
        alert("Gagal upload foto.");
      });
    });

    // Simpan data lainnya saat submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const gender = genderSelect.value;
      const bio = bioInput.value;

      // localStorage
      const data = { gender, bio, photoURL: photoDisplay.src };
      localStorage.setItem("profileData", JSON.stringify(data));

      // Firestore
      userRef.set(data, { merge: true })
        .then(() => alert("Profil berhasil disimpan!"))
        .catch((err) => {
          console.error(err);
          alert("Gagal menyimpan ke server.");
        });
    });

  } else {
    nameInput.value = "Nama Player";
    idInput.value = "ID123456";
    alert("Login untuk menyimpan ke server.");
  }
});
