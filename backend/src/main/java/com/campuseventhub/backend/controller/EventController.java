package com.campuseventhub.backend.controller;

import com.campuseventhub.backend.model.Event;
import com.campuseventhub.backend.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepo;

    // ✅ ADD EVENT (default ACTIVE)
    @PostMapping
    public Event addEvent(@RequestBody Event event) {
        if (event.getStatus() == null) {
            event.setStatus("ACTIVE");
        }
        return eventRepo.save(event);
    }


// ✅ GET ACTIVE EVENTS + AUTO INACTIVATE PAST EVENTS 🔥
@GetMapping
public List<Event> getAllEvents() {

    List<Event> events = eventRepo.findAll();

    for (Event e : events) {

        if (e.getDate() == null) continue;

        try {
            LocalDate eventDate = LocalDate.parse(e.getDate());

            if (eventDate.isBefore(LocalDate.now()) &&
                "ACTIVE".equalsIgnoreCase(e.getStatus())) {

                e.setStatus("INACTIVE");
                eventRepo.save(e); // optional (read below)
            }

        } catch (Exception ex) {
            // skip invalid date
        }
    }

    return eventRepo.findByStatusIgnoreCase("ACTIVE");
}
    // ✅ ADMIN: GET ALL EVENTS
    @GetMapping("/admin")
    public List<Event> getAllEventsAdmin() {
        return eventRepo.findAll();
    }

    // ✅ GET EVENT BY ID
    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // ✅ DELETE EVENT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (!eventRepo.existsById(id)) {
            return ResponseEntity.status(404).body("Event not found");
        }
        eventRepo.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ✅ UPDATE EVENT
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updated) {

        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(updated.getTitle());
        event.setCategory(updated.getCategory());
        event.setLocation(updated.getLocation());
        event.setDate(updated.getDate());

        event.setDescription(updated.getDescription());
        event.setTeamSize(updated.getTeamSize());
        event.setPrize(updated.getPrize());
        event.setOrganizer(updated.getOrganizer());
        event.setType(updated.getType());
        event.setImage(updated.getImage());
        event.setSchedule(updated.getSchedule());

        if (updated.getStatus() != null) {
            event.setStatus(updated.getStatus());
        }

        return eventRepo.save(event);
    }

    // ✅ TOGGLE STATUS
    @PutMapping("/{id}/toggle")
    public Event toggleEvent(@PathVariable Long id) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if ("ACTIVE".equalsIgnoreCase(event.getStatus())) {
            event.setStatus("INACTIVE");
        } else {
            event.setStatus("ACTIVE");
        }

        return eventRepo.save(event);
    }

    // ✅ UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String value) {

        Event event = eventRepo.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }

        String newStatus = "ACTIVE".equalsIgnoreCase(value) ? "ACTIVE" : "INACTIVE";
        event.setStatus(newStatus);

        eventRepo.save(event);

        return ResponseEntity.ok(event);
    }
    @DeleteMapping("/all")
public String deleteAllEvents() {
    eventRepo.deleteAll();
    return "All events deleted";
}
    @GetMapping("/ping")
public String ping() {
    return "alive";
}
}
