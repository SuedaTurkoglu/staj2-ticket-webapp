package staj.spring.ticket_webapp.departure_station;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class DepartureStationDTO extends BaseDTO {
    @NotNull(message = "Station is required.")
    private Long stationId;
    @NotNull(message = "Departure is required.")
    private Long departureId;
    @Positive
    private Integer orderInRoute;
    @NotNull(message = "Date is required.")
    private LocalDate date;
    @NotNull
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
}
