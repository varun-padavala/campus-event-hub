document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  try {
  const res = await fetch("https://campus-eventhub-67sn.onrender.com/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
 body: JSON.stringify({
  email: email,
  password: password
})
});

    const text = await res.text();

    if (!res.ok) {
      alert(text); // shows backend error
      return;
    }

    const user = JSON.parse(text);

    // ✅ SAVE USER
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ REDIRECT
    // ✅ role-based redirect
if (user.role === "ADMIN") {
  window.location.href = "admin/admin.html";
} else {
  window.location.href = "index.html";
}
  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
});