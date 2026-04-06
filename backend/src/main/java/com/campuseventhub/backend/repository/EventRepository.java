package com.campuseventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.campuseventhub.backend.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusIgnoreCase(String status);

}