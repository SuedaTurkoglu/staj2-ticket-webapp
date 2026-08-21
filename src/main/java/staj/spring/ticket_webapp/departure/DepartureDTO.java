package staj.spring.ticket_webapp.departure;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;
import staj.spring.ticket_webapp.station.StationDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class DepartureDTO extends BaseDTO {
    @NotNull(message = "Departure date is required.")
//    @JsonFormat(pattern = "yyyy-MM-dd") //cannot convert other date types, throws error instantly
    private LocalDate date;
    @NotNull(message = "Departure time is required.")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
    @NotNull
    private Long busId;
    @NotNull
    private Long driverId;
    @NotNull(message = "Start station is required.")
    private Long startStationId;
    @NotNull(message = "End station is required.")
    private Long endStationId;
    @Positive
    private Integer basePrice;
    @Positive
    private Integer pricePerKm;

    private List<StationDTO> stationList;

    private Long[] stationIds;
}
