const API = "http://127.0.0.1:8080/api";

/* AUTH */
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "ADMIN") {
  window.location.href = "/frontend/login.html";
}

/* LOAD EVENTS */
async function loadEvents() {
  const res = await fetch(`${API}/events/admin`);
  let events = await res.json();

  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  if (search) {
    events = events.filter(e =>
      e.title.toLowerCase().includes(search)
    );
  }

  if (category) {
    events = events.filter(e => e.category === category);
  }

  const list = document.getElementById("eventList");
  list.innerHTML = "";

  events.forEach(e => {
    list.innerHTML += `
      <div class="card" data-id="${e.id}">
        <h3>${e.title}</h3>
        <p>${e.category}</p>
        <p>${e.date}</p>

        <p>📍 ${e.location}</p>

        <p>
          Capacity: 
          <b>${e.capacity && e.capacity > 0 ? e.capacity : "Unlimited"}</b>
        </p>

        <p>
          Status: 
          <b class="status" style="color:${e.status === "ACTIVE" ? "lightgreen" : "red"}">
            ${e.status || "ACTIVE"}
          </b>
        </p>

        <div class="actions">
          <button onclick="viewApplicants(${e.id})">👁</button>

          <button class="toggle-btn"
            onclick="toggleEvent(${e.id}, '${e.status || "ACTIVE"}')">
            ${e.status === "ACTIVE" ? "⏸" : "▶"}
          </button>

          <button onclick="deleteEvent(${e.id})">❌</button>
        </div>
      </div>
    `;
  });
}

loadEvents();

/* ADD EVENT */
async function saveEvent() {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value.trim();

  const description = document.getElementById("description").value;
  const teamSize = document.getElementById("teamSize").value;
  const prize = document.getElementById("prize").value;
  const organizer = document.getElementById("organizer").value;
  const type = document.getElementById("type").value;
  const image = document.getElementById("image").value;
  const capacity = document.getElementById("capacity").value;
  const schedule = document.getElementById("schedule").value;
  const price = document.getElementById("price").value;

  if (!title || !category || !date || !location) {
    alert("Fill required fields");
    return;
  }

  const event = {
    title,
    category,
    date,
    location,
    description,
    teamSize: teamSize ? parseInt(teamSize) : 1,
    prize,
    organizer,
    price: parseFloat(price) || 0,
    type,
    image,
    capacity: capacity ? parseInt(capacity) : 0,
    schedule: schedule ? schedule.split(",") : [],
    status: "ACTIVE"
  };

  try {
    const res = await fetch(`${API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err);
      return;
    }

    alert("Event Added ✅");

    closeForm();
    loadEvents();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* MODAL */
function openForm() {
  document.getElementById("eventModal").style.display = "block";
}

function closeForm() {
  document.getElementById("eventModal").style.display = "none";
}

/* DELETE */
async function deleteEvent(id) {
  await fetch(`${API}/events/${id}`, {
    method: "DELETE"
  });

  // 🔥 REMOVE CARD INSTANTLY
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();
}

/* VIEW APPLICANTS */
function viewApplicants(id) {
  localStorage.setItem("eventId", id);
  window.location.href = "./admin-applicants.html";
}


/* LOGOUT */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "/frontend/login.html";
}

/* 🔥 INSTANT TOGGLE (NO RELOAD) */
async function toggleEvent(id, currentStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  const res = await fetch(`${API}/events/${id}/status?value=${newStatus}`, {
    method: "PUT"
  });

  if (!res.ok) {
    alert("Failed to update status");
    return;
  }

  // 🔥 UPDATE UI DIRECTLY
  const card = document.querySelector(`[data-id="${id}"]`);
  const statusEl = card.querySelector(".status");
  const btn = card.querySelector(".toggle-btn");

  statusEl.innerText = newStatus;
  statusEl.style.color = newStatus === "ACTIVE" ? "lightgreen" : "red";

  btn.innerText = newStatus === "ACTIVE" ? "⏸" : "▶";
  btn.setAttribute("onclick", `toggleEvent(${id}, '${newStatus}')`);
}

/* GLOBAL */
window.toggleEvent = toggleEvent;
window.deleteEvent = deleteEvent;
window.viewApplicants = viewApplicants;
window.openForm = openForm;
window.closeForm = closeForm;
window.saveEvent = saveEvent;