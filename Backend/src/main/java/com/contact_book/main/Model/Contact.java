package com.contact_book.main.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @NotNull(message = "Full name is required")
    @Size(min = 3, message = "Full name must be atleast 3 characters long")
    @Column(name = "full_name")
    private String full_name;

    @NotNull(message = "Email is required")
    @Email(message = "Enter a valid email")
    @Column(name = "email", unique = true)
    private String email;

    @NotNull(message = "Contact number is required")
    @Column(name = "contact_number")
    private String contact_number;
}
