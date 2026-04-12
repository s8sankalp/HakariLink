package com.url.shorter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ShorterApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().filename(".env.prod").ignoreIfMissing().load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(ShorterApplication.class, args);
	}

}
