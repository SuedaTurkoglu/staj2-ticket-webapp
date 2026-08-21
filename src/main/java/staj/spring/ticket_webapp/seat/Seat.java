package staj.spring.ticket_webapp.seat;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.bus.Bus;
import staj.spring.ticket_webapp.ticket.Ticket;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"seatNum", "bus_id"}))
public class Seat extends BaseEntity {

    @Positive
    private Integer seatNum;

    @Column(name = "bus_id")
    private Long busId;

    @ManyToOne
    @JoinColumn(name = "bus_id", updatable = false, insertable = false)
    private Bus bus;

    @OneToMany(mappedBy = "seat")
    private Set<Ticket> ticketSet;

}
