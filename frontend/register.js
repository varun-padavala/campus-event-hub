document.addEventListener("DOMContentLoaded", async () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // 🔥 AUTO FILL
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("roll").value = user.roll || "";

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  let event;
  const form = document.getElementById("regForm");
  const btn = form.querySelector("button");

  /* ===== LOAD EVENT ===== */
  try {
    const res = await fetch(`http://127.0.0.1:8080/api/events/${eventId}`);
    event = await res.json();

    document.getElementById("eventName").innerText = event.title;

  } catch (err) {
    console.error(err);
    alert("Failed to load event");
  }

  /* ===== CHECK IF ALREADY REGISTERED ===== */
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/registrations/user/${user.id}`
    );

    const regs = await res.json();
    const already = regs.find(r => r.event.id == eventId);

    if (already) {
      btn.innerText = "Already Registered";
      btn.disabled = true;
    }

  } catch (err) {
    console.error("Check failed", err);
  }

  /* ===== FORM SUBMIT ===== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (event && parseFloat(event.price) > 0){
      startFakePayment(user, eventId, event);
    } else {
      doRegistration(user, eventId, event);
    }
  });

});


/* ===== FAKE PAYMENT ===== */
function startFakePayment(user, eventId, event) {
console.log("Event price:", event.price);
console.log("PAYMENT CALLED");
  const modal = document.getElementById("paymentModal");
  const text = document.getElementById("paymentText");

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


/* ===== ACTUAL REGISTRATION ===== */
async function doRegistration(user, eventId, event) {

  const btn = document.querySelector("#regForm button");

  btn.disabled = true;
  btn.innerText = "Registering...";

  try {

    const roll = document.getElementById("roll").value;

    const res = await fetch(
      `http://127.0.0.1:8080/api/registrations?userId=${user.id}&eventId=${eventId}&roll=${roll}`,
      { method: "POST" }
    );

    if (!res.ok) {
      if (res.status === 400) {
        alert("⚠️ Already registered OR event is full");
        btn.innerText = "Unavailable";
      } else {
        alert("Server error");
        btn.innerText = "Register";
        btn.disabled = false;
      }
      return;
    }

    const data = await res.json();

    /* ===== SUCCESS ===== */
    btn.innerText = "Registered ✔";

    const qrImg = document.getElementById("qrImage");
    qrImg.style.display = "block";
    qrImg.src = `http://127.0.0.1:8080/api/registrations/${data.id}/qr`;

    document.getElementById("popupIcon").innerText = "🎉";
    document.getElementById("popupTitle").innerText = "Registration Confirmed";
    document.getElementById("popupEventName").innerText = event.title;

    document.getElementById("qrModal").style.display = "flex";

  } catch (err) {
    console.error(err);
    alert("Server error!");
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
  window.location.href = "index.html"; // or events.html
}