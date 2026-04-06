package com.campuseventhub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTicketWithQR(String to, String eventName, String ticketId, byte[] qrBytes) {
        try {
            System.out.println("EMAIL FUNCTION CALLED → sending to: " + to);

            MimeMessage message = mailSender.createMimeMessage();

            // ✅ UTF-8 FIX (important for emojis + Gmail)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // ✅ REQUIRED
            helper.setFrom("campuseventhubsupport@gmail.com");

            helper.setTo(to);
            helper.setSubject("🎟 Your Event Ticket");

            helper.setText(
                "<h2>Registration Confirmed ✅</h2>" +
                "<p><b>Event:</b> " + eventName + "</p>" +
                "<p><b>Ticket ID:</b> " + ticketId + "</p>" +
                "<p>Show QR at entry</p>",
                true
            );

            helper.addAttachment("ticket.png", new ByteArrayResource(qrBytes));

            mailSender.send(message);

            System.out.println("EMAIL SENT SUCCESSFULLY ✅");

        } catch (Exception e) {
            System.out.println("EMAIL FAILED ❌");
            e.printStackTrace();
        }
    }
}