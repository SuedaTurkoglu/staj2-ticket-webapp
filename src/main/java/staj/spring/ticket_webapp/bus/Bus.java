package staj.spring.ticket_webapp.bus;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.departure.Departure;
import staj.spring.ticket_webapp.seat.Seat;

import java.util.Set;

@Getter
@Setter
@Entity
public class Bus extends BaseEntity {
    @Column(unique = true, length = 15)
    private String plate;

    @Positive
    private Integer capacity;

    @OneToMany(mappedBy = "bus")
    private Set<Departure> departureSet;

    @OneToMany(mappedBy = "bus")
    private Set<Seat> seatSet;
}
