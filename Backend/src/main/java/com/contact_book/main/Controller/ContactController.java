package com.contact_book.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.contact_book.main.Exception.ContactNotFoundException;
import com.contact_book.main.Model.Contact;
import com.contact_book.main.Response.ErrorResponse;
import com.contact_book.main.Service.ContactService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@Validated
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/create-contact")
    public ResponseEntity<?> createContact(@Valid @RequestBody Contact contact) {
        try {
            return ResponseEntity.ok(contactService.createContact(contact));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }

    @GetMapping("/list-contacts")
    public ResponseEntity<?> getAllContactsOfAuthenticatedUser() {
        try {
            List<Contact> contacts = contactService.getAllContactsOfAuthenticatedUser();
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<?> getContactById(@PathVariable Integer contactId) {
        try {
            Contact contact = contactService.getSingleContactById(contactId);
            return ResponseEntity.ok(contact);
        } catch (ContactNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Contact not found with ID: " + contactId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }

    @PutMapping("/update-contact/{contactId}")
    public ResponseEntity<?> updateContact(@PathVariable Integer contactId,
            @Valid @RequestBody Contact updatedContact) {
        try {
            ResponseEntity<?> response = contactService.updateContact(contactId, updatedContact);
            return ResponseEntity.ok(response.getBody());
        } catch (ContactNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Contact not found with ID: " + contactId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }

    @DeleteMapping("/delete-contact/{contactId}")
    public ResponseEntity<?> deleteContact(@PathVariable Integer contactId) {
        try {
            ResponseEntity<?> contact = contactService.deleteContact(contactId);
            return ResponseEntity.ok(contact);
        } catch (ContactNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Contact not found with ID: " + contactId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }

    @GetMapping("/search-contacts/{searchTerm}")
    public ResponseEntity<?> searchContacts(@PathVariable String searchTerm) {
        try {
            List<Contact> contacts = contactService.searchContact(searchTerm);
            return ResponseEntity.ok(contacts);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("An error occurred"));
        }
    }
}
