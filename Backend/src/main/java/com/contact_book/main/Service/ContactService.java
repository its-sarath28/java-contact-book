package com.contact_book.main.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.contact_book.main.Exception.ContactNotFoundException;
import com.contact_book.main.Model.Contact;
import com.contact_book.main.Model.User;
import com.contact_book.main.Repository.ContactRepository;
import com.contact_book.main.Repository.UserRepository;
import com.contact_book.main.Response.ContactResponse;
import com.contact_book.main.Response.ErrorResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Here");
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            // return (User) authentication.getPrincipal();
            User user = (User) authentication.getPrincipal();
            System.out.println("Authenticated user: " + user.getEmail());
            return user;
        } else {
            throw new IllegalStateException("User not found in Security Context");
        }
    }

    public ContactResponse createContact(Contact contact) {

        // Retrieve the currently logged-in user's email from the security context
        User user = getCurrentUser();
        String userEmail = user.getEmail();

        // Fetch the user from the database using the email
        User existingUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contact newContact = new Contact();

        newContact.setFull_name(contact.getFull_name());
        newContact.setEmail(contact.getEmail());
        newContact.setContact_number(contact.getContact_number());
        newContact.setUser(existingUser);

        contactRepository.save(newContact);

        return new ContactResponse("New contact created successfully");
    }

    public List<Contact> getAllContactsOfAuthenticatedUser() {
        User user = getCurrentUser();

        // Fetch contact numbers for the authenticated user
        List<Contact> contacts = contactRepository.findByUser(user);

        // Sort the contact numbers by full name in ascending order
        List<Contact> sortedContacts = contacts.stream()
                .sorted(Comparator.comparing(Contact::getFull_name))
                .collect(Collectors.toList());

        return sortedContacts;
    }

    public Contact getSingleContactById(@PathVariable Integer contactId) {
        User user = getCurrentUser();

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException(contactId));

        if (!contact.getUser().getId().equals(user.getId())) {
            throw new ContactNotFoundException(contactId);
        }

        return contact;
    }

    public ResponseEntity<?> updateContact(@PathVariable Integer contactId, @RequestBody Contact updatedContact) {
        User user = getCurrentUser();

        Contact contactToUpdate = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException(contactId));

        // Check if the contact number belongs to the logged-in user
        if (!contactToUpdate.getUser().getId().equals(user.getId())) {
            ErrorResponse errorResponse = new ErrorResponse("Action not allowed");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }

        contactToUpdate.setFull_name(updatedContact.getFull_name());
        contactToUpdate.setEmail(updatedContact.getEmail());
        contactToUpdate.setContact_number(updatedContact.getContact_number());

        contactRepository.save(contactToUpdate);

        ContactResponse response = new ContactResponse("Contact number updated successfully");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> deleteContact(@PathVariable Integer contactId) {
        User user = getCurrentUser();

        Contact contactToUpdate = contactRepository.findById(contactId)
                .orElseThrow(() -> new ContactNotFoundException(contactId));

        // Check if the contact belongs to the logged-in user
        if (!contactToUpdate.getUser().getId().equals(user.getId())) {
            ErrorResponse errorResponse = new ErrorResponse("Action not allowed");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }

        contactRepository.delete(contactToUpdate);

        ContactResponse response = new ContactResponse("Contact number deleted successfully");
        return ResponseEntity.ok(response);
    }

    public List<Contact> searchContact(String searchTerm) {
        User user = getCurrentUser();

        List<Contact> contacts = contactRepository.findByUser(user);

        List<Contact> filteredContacts = contacts.stream()
                .filter(contact -> contact.getFull_name().toLowerCase().contains(searchTerm.toLowerCase())
                        || contact.getEmail().toLowerCase().contains(searchTerm.toLowerCase())
                        || contact.getContact_number().contains(searchTerm))
                .sorted(Comparator.comparing(Contact::getFull_name)).collect(Collectors.toList());

        return filteredContacts;
    }

}
