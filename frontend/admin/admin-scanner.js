const API = "https://campus-eventhub-67sn.onrender.com/api";

/* ===== AUTH CHECK ===== */
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "ADMIN") {
  window.location.href = "../login.html";
}

/* ===== SCAN CONTROL ===== */
let scanning = false;
let scanner;

/* ===== INIT SCANNER ===== */
function startScanner() {
  scanning = false;

  scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
  });

  scanner.render(onScanSuccess);
}

startScanner();

/* ===== SCAN SUCCESS ===== */
function onScanSuccess(decodedText) {
  if (scanning) return;   // 🚫 prevent double scan

  scanning = true;

  console.log("Scanned:", decodedText);

  // 🔥 STOP SCANNER IMMEDIATELY
  scanner.clear();

  verifyTicket(decodedText);
}

/* ===== VERIFY ===== */
async function verifyTicket(id) {
  try {
    const res = await fetch(`${API}/registrations/verify?ticketId=${id}`);
    const data = await res.text();

    const box = document.getElementById("result");

    // RESET + SHOW
    box.className = "scan-result active";

    let icon = "❌";

    if (data.includes("Valid")) {
      box.classList.add("scan-success");
      icon = "✅";
    } else if (data.includes("Already")) {
      box.classList.add("scan-warning");
      icon = "⚠️";
    } else {
      box.classList.add("scan-error");
    }

    // CLEAN FORMAT
    const lines = data.split("\n");

    box.innerHTML = `
      <strong>${icon} ${lines[0]}</strong>
      <div style="margin-top:10px; opacity:0.9;">
        ${lines.slice(1).join("<br>")}
      </div>
    `;

  } catch (err) {
    console.error(err);
  }
  document.getElementById("scanAgainBtn").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
}

/* ===== SCAN AGAIN BUTTON ===== */
function scanAgain() {
  const box = document.getElementById("result");

  box.className = "scan-result";
  box.innerHTML = "";

  document.getElementById("scanAgainBtn").style.display = "none";

  // 🔥 CLEAR OLD SCANNER FIRST
  if (scanner) {
    scanner.clear();
  }

  startScanner(); // restart camera
}

/* ===== MANUAL BACKUP ===== */
function verifyManual() {
  const id = document.getElementById("manualId").value.trim();
  verifyTicket(id);
}
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../login.html";
}