package com.campuseventhub.backend.controller;

import com.campuseventhub.backend.model.*;
import com.campuseventhub.backend.repository.*;
import com.campuseventhub.backend.service.EmailService;
import com.campuseventhub.backend.service.QRService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationRepository regRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private QRService qrService;

    @Autowired
    private EmailService emailService;

    // 🔥 REGISTER USER (FINAL FIXED)
@PostMapping
public ResponseEntity<?> register(
        @RequestParam Long userId,
        @RequestParam Long eventId,
        @RequestParam String roll) {

    User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    Event event = eventRepo.findById(eventId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

    // ❌ Already registered
    if (regRepo.existsByUser_IdAndEvent_Id(userId, eventId)) {
        return ResponseEntity.status(400).body("Already registered");
    }

    // ❌ Capacity check
    long count = regRepo.countByEvent_Id(eventId);
    Integer cap = event.getCapacity();

    if (cap != null && cap > 0 && count >= cap) {
        return ResponseEntity.status(400).body("Event full");
    }

    // ✅ Create ticket
    String ticketId = "EVT-" + userId + "-" + eventId + "-" + System.currentTimeMillis();

    Registration reg = new Registration();
    reg.setUser(user);
    reg.setEvent(event);
    reg.setTicketId(ticketId);
    reg.setUsed(false);
    reg.setRoll(roll);

    Registration saved = regRepo.save(reg);

    // 🔥 ASYNC EMAIL (IMPORTANT)
    new Thread(() -> {
        try {
            byte[] qr = qrService.generateQR(ticketId);

            emailService.sendTicketWithQR(
                    user.getEmail(),
                    event.getTitle(),
                    ticketId,
                    qr
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();

    return ResponseEntity.ok(saved);
}
    // 🔥 GET QR
    @GetMapping(value = "/{id}/qr", produces = "image/png")
    public byte[] getQR(@PathVariable Long id) throws Exception {

        Registration reg = regRepo.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        return qrService.generateQR(reg.getTicketId());
    }

    // 🔥 VALIDATE QR
    @PostMapping("/validate")
    public String validateTicket(@RequestParam String ticketId) {

        Registration reg = regRepo.findByTicketId(ticketId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ticket"));

        if (reg.isUsed()) {
            return "Ticket already used ❌";
        }

        reg.setUsed(true);
        regRepo.save(reg);

        return "Entry allowed ✅";
    }

    // 🔥 USER REGISTRATIONS
    @GetMapping("/user/{userId}")
    public List<Registration> getUserRegistrations(@PathVariable Long userId) {
        return regRepo.findByUser_Id(userId);
    }

    // 🔥 VERIFY
    @GetMapping("/verify")
    public ResponseEntity<?> verifyTicket(@RequestParam String ticketId) {

        Registration reg = regRepo.findByTicketId(ticketId).orElse(null);

        if (reg == null) {
            return ResponseEntity.status(404).body("❌ Invalid Ticket");
        }

        if (reg.isUsed()) {
            return ResponseEntity.ok(
                    "⚠️ Already Used\n" +
                    "Event: " + reg.getEvent().getTitle() + "\n" +
                    "User: " + reg.getUser().getEmail() + "\n" +
                    "Roll: " + reg.getRoll()
            );
        }

        reg.setUsed(true);
        regRepo.save(reg);

        return ResponseEntity.ok(
                "✅ Valid Ticket\n" +
                "Event: " + reg.getEvent().getTitle() + "\n" +
                "User: " + reg.getUser().getEmail() + "\n" +
                "Roll: " + reg.getRoll()
        );
    }

    // 🔥 EVENT REGISTRATIONS
    @GetMapping("/event/{eventId}")
    public List<Registration> getRegistrationsByEvent(@PathVariable Long eventId) {
        return regRepo.findByEvent_Id(eventId);
    }

    // 🔥 GET ALL
    @GetMapping
    public List<Registration> getAll() {
        return regRepo.findAll();
    }



@DeleteMapping("/{id}")
public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {

    Registration reg = regRepo.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

    Event event = reg.getEvent();

    try {
        // 🔥 Convert string to date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // adjust format if needed
        Date eventDate = sdf.parse(event.getDate());

        long diffMillis = eventDate.getTime() - System.currentTimeMillis();
        long diffHours = diffMillis / (1000 * 60 * 60);

        if (diffHours < 24) {
        return ResponseEntity
            .badRequest()
            .body("Cannot cancel within 24 hours of event");
        }

    } catch (Exception e) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid event date format"
        );
    }

    regRepo.delete(reg);

    return ResponseEntity.ok("Registration cancelled");
}
 @DeleteMapping("/all")
public String deleteAllRegistrations() {
    regRepo.deleteAll(); 
    return "All registrations deleted";
}
}