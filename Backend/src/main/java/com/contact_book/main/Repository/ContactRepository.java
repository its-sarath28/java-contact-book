package com.contact_book.main.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.contact_book.main.Model.Contact;
import com.contact_book.main.Model.User;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
    List<Contact> findByUser(User user);
}
