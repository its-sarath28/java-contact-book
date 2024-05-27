package com.contact_book.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("jwt.secret", dotenv.get("JWT_SECRET_KEY"));

		SpringApplication.run(MainApplication.class, args);
	}

}
