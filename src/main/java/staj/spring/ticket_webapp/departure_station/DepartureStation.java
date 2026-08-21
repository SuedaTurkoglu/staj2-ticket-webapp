package staj.spring.ticket_webapp.departure_station;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.departure.Departure;
import staj.spring.ticket_webapp.station.Station;
import staj.spring.ticket_webapp.ticket.Ticket;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"order_in_route", "departure_id"})})
public class DepartureStation extends BaseEntity {

    @Column(name = "station_id")
    private Long stationId;

    @ManyToOne
    @JoinColumn(name = "station_id", updatable = false, insertable = false)
    private Station station;

    @Column(name = "departure_id")
    private Long departureId;

    @ManyToOne
    @JoinColumn(name = "departure_id", updatable = false, insertable = false)
    private Departure departure;

    @Positive
    private Integer orderInRoute;

    @FutureOrPresent
    private LocalDate date;

    private LocalTime time;

    @OneToMany(mappedBy = "departureStationStart")
    private Set<Ticket> ticketSetStart;

    @OneToMany(mappedBy = "departureStationEnd")
    private Set<Ticket> ticketSetEnd;

}
