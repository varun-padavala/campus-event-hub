let allEvents = [];

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

/* ✅ GET QUERY PARAMS */
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const search = params.get("search") || "";
  const category = params.get("category") || "all";

  searchInput.value = search;
  categoryFilter.value = category;

  return { search, category };
}

/* ✅ LOAD EVENTS */
async function loadEvents() {
  try {
    const res = await fetch("https://campus-eventhub-67sn.onrender.com/api/events");
    const events = await res.json();

    // ✅ KEEP ONLY ACTIVE (admin controlled)
    allEvents = events.filter(e => e.status === "ACTIVE");

    renderEvents(allEvents);

  } catch (err) {
    console.error("Error loading events:", err);
  }
}

/* ✅ FORMAT DATE */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

/* ✅ RENDER EVENTS */
function renderEvents(events) {
  const container = document.getElementById("eventsContainer");
  const noResults = document.getElementById("noResults");

  container.innerHTML = "";

  if (!events || events.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "card";

    // ✅ use actual event image
    const imageUrl = (event.image && event.image.startsWith("http"))
      ? event.image
      : "https://via.placeholder.com/400x300";

    card.innerHTML = `
      <img src="${imageUrl}" class="event-img" />

      <div class="card-content">
        <h3>${event.title}</h3>
        <p>${event.category || ""}</p>
        <p>${formatDate(event.date)}</p>

        <a href="event-details.html?eventId=${event.id}" class="btn">
          View Details
        </a>
      </div>
    `;

    // 🔥 fallback if image fails
    const img = card.querySelector("img");
    img.onerror = () => {
      img.onerror = null;
      img.src = "https://via.placeholder.com/400x300";
    };

    container.appendChild(card);
  });
}
/* ✅ FILTER */
function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = allEvents.filter(e =>
    e.title.toLowerCase().includes(search) &&
    (category === "all" || (e.category || "").toLowerCase() === category)
  );

  renderEvents(filtered);
}

/* EVENTS */
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {
  const { search, category } = getQueryParams();

  await loadEvents();

  if (search || category !== "all") {
    applyFilters();
  }
});