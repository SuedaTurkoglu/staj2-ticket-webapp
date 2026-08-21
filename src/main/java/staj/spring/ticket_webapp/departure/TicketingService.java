package staj.spring.ticket_webapp.departure;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

public interface TicketingService {

    Integer[] calculatePrice(Long departureId, Long startStationId, Long endStationId);

    Integer calculatePriceForTicket(Long departureId, Long startStationId, Long endStationId);

    LocalTime[] calculateTime(Long departureId, Long startStationId, Long endStationId);
    
    LocalDate calculateStartDate(Long departureId, Long startStationId);

    Map<Integer, Boolean> getTicketListOfDeparture(Long departureId, Long startStationId, Long endStationId);
}
