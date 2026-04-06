document.addEventListener("DOMContentLoaded", async () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // AUTO FILL
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("roll").value = user.roll || "";

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  let event = null;
  const form = document.getElementById("regForm");
  const btn = form.querySelector("button");

  /* ===== LOAD EVENT ===== */
  try {
    const res = await fetch(`https://campus-eventhub-67sn.onrender.com/api/events/${eventId}`);
    event = await res.json();

    document.getElementById("eventName").innerText = event.title;

  } catch (err) {
    alert("Failed to load event");
  }

  /* ===== CHECK ALREADY REGISTERED ===== */
  try {
    const res = await fetch(
      `https://campus-eventhub-67sn.onrender.com/api/registrations/user/${user.id}`
    );

    const regs = await res.json();
    const already = regs.find(r => r.event.id == eventId);

    if (already) {
      btn.innerText = "Already Registered";
      btn.disabled = true;
      return; // 🔥 STOP EVERYTHING
    }

  } catch (err) {
    console.error("Check failed", err);
  }

  /* ===== FORM SUBMIT ===== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!event) return alert("Event not loaded");

    const price = Number(event.price || 0);

    if (price > 0){
      startFakePayment(user, eventId, event);
    } else {
      doRegistration(user, eventId, event);
    }
  });

});


/* ===== PAYMENT ===== */
function startFakePayment(user, eventId, event) {

  const modal = document.getElementById("paymentModal");
  const text = document.getElementById("paymentText");

  if (!modal || !text) {
    doRegistration(user, eventId, event);
    return;
  }

  modal.style.display = "flex";
  text.innerText = `Processing ₹${event.price} payment...`;

  setTimeout(() => {
    text.innerText = "Payment successful ✅";

    setTimeout(() => {
      modal.style.display = "none";
      doRegistration(user, eventId, event);
    }, 1000);

  }, 2000);
}


/* ===== REGISTRATION ===== */
async function doRegistration(user, eventId, event) {

  const btn = document.querySelector("#regForm button");
  btn.disabled = true;
  btn.innerText = "Registering...";

  try {

    const roll = document.getElementById("roll").value;

    const res = await fetch(
      `https://campus-eventhub-67sn.onrender.com/api/registrations?userId=${user.id}&eventId=${eventId}&roll=${roll}`,
      { method: "POST" }
    );

    if (!res.ok) {

      if (res.status === 400) {
        // 🔥 Already registered fallback
        btn.innerText = "Already Registered";
        btn.disabled = true;
        return;
      }

      alert("Server error");
      btn.innerText = "Register";
      btn.disabled = false;
      return;
    }

    const data = await res.json();

    if (!data || !data.id) {
      alert("Registration failed");
      btn.innerText = "Register";
      btn.disabled = false;
      return;
    }

    // ✅ SUCCESS UI
    btn.innerText = "Registered ✔";

    const qrImg = document.getElementById("qrImage");
    const modal = document.getElementById("qrModal");

    if (qrImg) {
      qrImg.src = `https://campus-eventhub-67sn.onrender.com/api/registrations/${data.id}/qr`;
    }

    if (modal) {
      document.getElementById("popupIcon").innerText = "🎉";
      document.getElementById("popupTitle").innerText = "Registration Confirmed";
      document.getElementById("popupEventName").innerText = event.title;
      modal.style.display = "flex";
    }

  } catch (err) {
    alert("Server error");
    btn.innerText = "Register";
    btn.disabled = false;
  }
}


/* ===== POPUP FUNCTIONS ===== */
function closeModal() {
  document.getElementById("qrModal").style.display = "none";
}

function downloadQR() {
  const img = document.getElementById("qrImage");
  const link = document.createElement("a");
  link.href = img.src;
  link.download = "ticket.png";
  link.click();
}

function goBack() {
  window.location.href = "index.html";
}
