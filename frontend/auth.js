/* ===== NAVBAR AUTH HANDLER ===== */
document.addEventListener("DOMContentLoaded", () => {

  const navUser = document.getElementById("navUser");
  if (!navUser) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    navUser.innerHTML = `
      <div class="user-box">
        <span class="avatar">${(user.name || user.email).charAt(0).toUpperCase()}</span>
        <span>${user.name || user.email}</span>
        <button onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    navUser.innerHTML = `
      <button class="login-btn" onclick="goToLogin()">Login</button>
    `;
  }
});

/* ===== NAVIGATION ===== */
function goToLogin() {
  window.location.href = "login.html";
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("user");   // 🔥 IMPORTANT FIX
  window.location.href = "login.html";
}