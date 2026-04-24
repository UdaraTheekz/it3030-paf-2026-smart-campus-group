package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.smartcampus.repository")
public class SmartCampusApplication {

	public static void main(String[] args) {
		// Start the Smart Campus application
		SpringApplication.run(SmartCampusApplication.class, args);
	}

}
