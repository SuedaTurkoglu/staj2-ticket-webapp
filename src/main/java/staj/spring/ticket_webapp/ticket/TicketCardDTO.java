package staj.spring.ticket_webapp.ticket;

import jakarta.validation.constraints.NotNull;
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
import java.util.Map;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class TicketCardDTO extends BaseDTO {
    @NotNull
    private Long ticketId;

    @NotNull
    private LocalDate startDate;

    @Positive
    private Integer priceCalculated;

    @NotNull
    @Positive
    private Integer seatNum;

    @NotNull
    private List<StationTimeEntryDTO> stationTimes;

    @NotNull
    @Positive
    private Long passengerTckn;

    @NotNull
    private String passengerName;

    @NotNull
    private String passengerSurname;

}
