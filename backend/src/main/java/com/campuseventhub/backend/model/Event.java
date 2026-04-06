package com.campuseventhub.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String date;
    private String location;

    @Column(length = 1000)
    private String description;

    private String teamSize;
    private String prize;
    private String organizer;
    private String type;
    private Double price = 0.0;
    private String image;
    private Integer capacity;
    private String status;

    // ✅ SCHEDULE (SEPARATE)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_schedule", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "schedule_item")
    private List<String> schedule = new ArrayList<>();

    // ✅ CASCADE DELETE FIX (SEPARATE)
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Registration> registrations = new ArrayList<>();

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTeamSize() { return teamSize; }
    public void setTeamSize(String teamSize) { this.teamSize = teamSize; }

    public String getPrize() { return prize; }
    public void setPrize(String prize) { this.prize = prize; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public List<String> getSchedule() { return schedule; }
    public void setSchedule(List<String> schedule) {
        this.schedule = (schedule != null) ? schedule : new ArrayList<>();
    }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}