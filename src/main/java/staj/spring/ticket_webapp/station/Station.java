package staj.spring.ticket_webapp.station;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.departure.Departure;
import staj.spring.ticket_webapp.departure_station.DepartureStation;
import staj.spring.ticket_webapp.station_combination.StationCombination;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"city", "district", "coordinate"}))
public class Station extends BaseEntity {
    @Size(max = 48)
    private String city;

    @Size(max = 48)
    private String district;

    @Size(max = 48)
    private String coordinate;

    @OneToMany(mappedBy = "startStation")
    private Set<Departure> departureSet;

    @OneToMany(mappedBy = "station")
    private Set<DepartureStation> departureStationSet;

    @OneToMany(mappedBy = "stationA")
    private Set<StationCombination> stationCombinationA = new HashSet<>();

    @OneToMany(mappedBy = "stationB")
    private Set<StationCombination> stationCombinationB = new HashSet<>();
}
