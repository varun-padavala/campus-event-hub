package com.campuseventhub.backend.repository;

import com.campuseventhub.backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUser_Id(Long userId);

    boolean existsByUser_IdAndEvent_Id(Long userId, Long eventId);

    Optional<Registration> findByTicketId(String ticketId);

    long countByEvent_Id(Long eventId);
    List<Registration> findByEvent_Id(Long eventId);
}