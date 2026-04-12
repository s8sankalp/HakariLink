package com.url.shorter;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class ShorterApplicationTests {

    static {
        Dotenv dotenv = Dotenv.configure().filename(".env.prod").ignoreIfMissing().load();
        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
    }

	@Test
	void contextLoads() {
	}

}
