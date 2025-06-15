window.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    alert("Login berhasil untuk email: " + email);
    // Nanti tambahkan logic redirect ke dashboard
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
});
