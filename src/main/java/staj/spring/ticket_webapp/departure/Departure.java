package staj.spring.ticket_webapp.departure;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.bus.Bus;
import staj.spring.ticket_webapp.departure_station.DepartureStation;
import staj.spring.ticket_webapp.station.Station;
import staj.spring.ticket_webapp.ticket.Ticket;
import staj.spring.ticket_webapp.user.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"driver_id", "date", "time"}),
        @UniqueConstraint(columnNames = {"bus_id", "date", "time"}),
        @UniqueConstraint(columnNames = {"start_station_id", "end_station_id"})})
public class Departure extends BaseEntity {
    @FutureOrPresent
    private LocalDate date;

    private LocalTime time;

    @Column(name = "bus_id")
    private Long busId;

    @ManyToOne
    @JoinColumn(name = "bus_id", updatable = false, insertable = false)
    private Bus bus;

    @Column(name = "driver_id")
    private Long driverId;

    @ManyToOne
    @JoinColumn(name = "driver_id", updatable = false, insertable = false)
    private User driver;

    @Column(name = "start_station_id")
    private Long startStationId;

    @ManyToOne
    @JoinColumn(name = "start_station_id", updatable = false, insertable = false)
    private Station startStation;

    @Column(name = "end_station_id")
    private Long endStationId;

    @ManyToOne
    @JoinColumn(name = "end_station_id", updatable = false, insertable = false)
    private Station endStation;

    @Positive
    private Integer basePrice;

    @Positive
    private Integer pricePerKm;

    @OneToMany(mappedBy = "departure")
    private Set<Ticket> ticketSet;

    @OrderBy("orderInRoute asc")
    @OneToMany(mappedBy = "departure")
    private Set<DepartureStation> departureStationSet;


}
