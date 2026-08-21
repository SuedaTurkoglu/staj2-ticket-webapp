package staj.spring.ticket_webapp.ticket;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.departure.Departure;
import staj.spring.ticket_webapp.departure_station.DepartureStation;
import staj.spring.ticket_webapp.seat.Seat;
import staj.spring.ticket_webapp.user.User;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"departure_id", "seat_id"}))
public class Ticket extends BaseEntity {

    @Positive
    private Integer priceCalculated;

    @Column(name = "seat_id")
    private Long seatId;

    @ManyToOne
    @JoinColumn(name = "seat_id", updatable = false, insertable = false)
    private Seat seat;

    @Column(name = "departure_id")
    private Long departureId;

    @ManyToOne
    @JoinColumn(name = "departure_id", updatable = false, insertable = false)
    private Departure departure;

    @Column(name = "departure_station_start_id")
    private Long departureStationStartId;

    @ManyToOne
    @JoinColumn(name = "departure_station_start_id", updatable = false, insertable = false)
    private DepartureStation departureStationStart;

    @Column(name = "departure_station_end_id")
    private Long departureStationEndId;

    @ManyToOne
    @JoinColumn(name = "departure_station_end_id", updatable = false, insertable = false)
    private DepartureStation departureStationEnd;

    @Column(length = 11)
    private Long passengerTckn;

    @Size(min = 3)
    private String passengerName;

    @Size(min = 3)
    private String passengerSurname;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_id", updatable = false, insertable = false)
    private User user;
}
