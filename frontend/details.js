const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

fetch(`http://127.0.0.1:8080/api/events/${eventId}`)
  .then(res => res.json())
  .then(event => {

    // ===== TOP SECTION =====
    document.getElementById("eventTitle").innerText = event.title;
    document.getElementById("eventDate").innerText = event.date;
    document.getElementById("eventLocation").innerText = event.location || "India";

    // ===== EXTRA DETAILS =====
    document.getElementById("eventDesc").innerText = event.description || "No description";
    document.getElementById("eventTeam").innerText = event.teamSize || "N/A";
    document.getElementById("eventPrize").innerText = event.prize || "N/A";
    document.getElementById("eventOrganizer").innerText = event.organizer || "College";
    document.getElementById("eventType").innerText = event.category || "General";

    // ===== ✅ IMAGE (FINAL FIX) =====
    

const img = document.getElementById("eventImage");

if (event.image && event.image.startsWith("http")) {
  img.src = event.image;
} else {
  img.src = `https://picsum.photos/600/300?random=${event.id}`;
}

// 🔥 prevent infinite loop
img.onerror = () => {
  img.onerror = null;
  img.src = `https://picsum.photos/600/300?random=${event.id}`;
};
    // ===== SCHEDULE =====
    const list = document.getElementById("eventSchedule");
    list.innerHTML = "";

    if (event.schedule && event.schedule.length > 0) {
      event.schedule.forEach(item => {
        list.innerHTML += `<li>${item}</li>`;
      });
    } else {
      list.innerHTML = `<li>${event.date}</li>`;
    }

  })
  .catch(err => {
    console.error(err);
    alert("Failed to load event");
  });

function goToRegister() {
  window.location.href = `register.html?eventId=${eventId}`;
}