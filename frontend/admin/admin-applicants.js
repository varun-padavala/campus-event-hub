const API = "https://campus-eventhub-67sn.onrender.com/api";

const eventId = localStorage.getItem("eventId");

async function loadApplicants() {
  const res = await fetch(`${API}/registrations/event/${eventId}`);
  const data = await res.json();

  const container = document.getElementById("applicantsList");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No registrations yet</p>";
    return;
  }

  data.forEach(r => {
    container.innerHTML += `
      <div class="card">
        <p><b>Email:</b> ${r.user.email}</p>
        <p><b>Roll:</b> ${r.roll}</p>
        <p><b>Ticket:</b> ${r.ticketId}</p>

        <p>
          Status:
          <span style="color:${r.used ? "red" : "lightgreen"}">
            ${r.used ? "Used" : "Not Used"}
          </span>
        </p>
      </div>
    `;
  });
}
function goBack() {
  window.location.href = "admin-events.html"; // 🔥 go back to events
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/frontend/login.html";
}

loadApplicants();