package staj.spring.ticket_webapp.station_combination;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.station.Station;

import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"station_a_id", "station_b_id"}))
public class StationCombination extends BaseEntity {

    @Column(name = "station_a_id")
    private Long stationAId;

    @ManyToOne
    @JoinColumn(name = "station_a_id", nullable = false, updatable = false, insertable = false)
    private Station stationA;

    @Column(name = "station_b_id")
    private Long stationBId;

    @ManyToOne
    @JoinColumn(name = "station_b_id", nullable = false, updatable = false, insertable = false)
    private Station stationB;

    @Positive
    private Integer distance;

    @Positive
    private Integer duration;

}
