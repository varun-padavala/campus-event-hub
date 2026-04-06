document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    roll: document.getElementById("roll").value,
    branch: document.getElementById("branch").value,
    section: document.getElementById("section").value,
    phone: document.getElementById("phone").value
  };

  try {
    const res = await fetch("https://campus-eventhub-67sn.onrender.com/api/auth/register", {  // ✅ FIXED
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const text = await res.text();

    if (!res.ok) {
      alert(text);
      return;
    }

    alert("Account created successfully!");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});