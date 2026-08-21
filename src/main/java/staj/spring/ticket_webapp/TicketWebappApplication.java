package staj.spring.ticket_webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TicketWebappApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketWebappApplication.class, args);
    }

}
