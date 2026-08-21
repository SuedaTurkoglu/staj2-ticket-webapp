package staj.spring.ticket_webapp.departure;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class DepartureCardDTO extends BaseDTO {
    @NotNull
    private Long departureId;
    @NotNull
    private LocalDate queryStartDate;
    @NotNull
    private String queryStartStationName;
    @NotNull
    private String queryEndStationName;
    @NotNull
    private String startStationName;
    @NotNull
    private String endStationName;
    @NotNull
    @Positive
    private Integer seatLeft;
    @NotNull
    @Positive
    private Integer queryDistance;
    @NotNull
    @Positive
    private Integer queryPrice;
    @NotNull
    private Integer queryDuration; // as minutes
    @NotNull
    private LocalTime queryStartTime;
    @NotNull
    private LocalTime queryEndTime;
    @NotNull
    @Positive
    private Integer busCapacity;

    private Map<Integer, Boolean> seatMap;

}
