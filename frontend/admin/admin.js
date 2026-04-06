const API = "https://campus-eventhub-67sn.onrender.com/api";

/* AUTH */
const currentUser = JSON.parse(localStorage.getItem("user"));
if (!currentUser || currentUser.role !== "ADMIN") {
  window.location.href = "../login.html";
}

/* DASHBOARD */
async function loadDashboard() {
  try {
    const eventsRes = await fetch(`${API}/events`);
    const events = await eventsRes.json();

    const regRes = await fetch(`${API}/registrations`);
    const regs = await regRes.json();

    document.getElementById("totalEvents").innerText = events.length;
    document.getElementById("totalRegs").innerText = regs.length;

    const active = events.filter(e => e.status === "ACTIVE").length;
    document.getElementById("activeEvents").innerText = active;

  } catch (err) {
    console.error(err);
  }
}

/* RUN AFTER LOAD */
document.addEventListener("DOMContentLoaded", loadDashboard);

/* NAV */
function goToEvents() {
  window.location.href = "admin-events.html";
}

function goToScanner() {
  window.location.href = "admin-scanner.html";
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../login.html";
}