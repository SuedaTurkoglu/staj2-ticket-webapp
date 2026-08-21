package staj.spring.ticket_webapp.ticket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.station.StationDTO;

import java.time.LocalTime;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class StationTimeEntryDTO {
    private StationDTO station;
    private LocalTime time;
}