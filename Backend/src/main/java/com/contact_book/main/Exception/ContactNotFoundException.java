package com.contact_book.main.Exception;

public class ContactNotFoundException extends RuntimeException {
    public ContactNotFoundException(Integer id) {
        super("Contact number not found with id: " + id);
    }
}
