/* ===== LOAD USER ===== */
const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.id) {
  alert("Please login first!");
  window.location.href = "login.html";
}

/* ===== LOAD FROM BACKEND ===== */
async function loadRegistrations() {
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/registrations/user/${user.id}`
    );

    const registrations = await res.json();

    const container = document.getElementById("regContainer");
    container.innerHTML = "";

    if (registrations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h2>No registrations yet</h2>
          <p>You haven’t registered for any events.</p>
          <a href="events.html" class="btn">Browse Events</a>
        </div>
      `;
      return;
    }

    registrations.forEach(reg => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
  <div class="card-content">
    <h3>${reg.event.title}</h3>
    <p>👤 ${reg.user.email}</p>
    <p>🎟 Ticket: ${reg.ticketId}</p>

    <p>Status: ${reg.used ? "Used ✅" : "Active 🎟"}</p>

    ${reg.used 
      ? `<button class="cancel-btn" disabled style="background: gray; cursor: not-allowed;">
            Used
         </button>`
      : `<button class="cancel-btn" onclick="cancelReg(${reg.id})">
            Cancel ❌
         </button>`
    }
  </div>
`;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load registrations");
  }
}

/* ===== CANCEL (BACKEND) ===== */
async function cancelReg(id) {
  if (!confirm("Are you sure you want to cancel?")) return;

  try {
    const res = await fetch(`http://127.0.0.1:8080/api/registrations/${id}`, {
      method: "DELETE"
    });

    const text = await res.text();

    if (!res.ok) {
      // 🔥 SHOW BACKEND MESSAGE
      alert(text);
      return;
    }

    alert("Registration cancelled ✅");
    loadRegistrations();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* ===== INIT ===== */
loadRegistrations();