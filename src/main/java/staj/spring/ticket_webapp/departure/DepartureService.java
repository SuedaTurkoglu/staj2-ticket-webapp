package staj.spring.ticket_webapp.departure;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestHeader;
import staj.spring.ticket_webapp.seat.SeatDTO;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

import java.time.LocalDate;
import java.util.List;

public interface DepartureService {

    Page<DepartureDTO> getAllDepartures(Pageable pageable);

    Page<DepartureDTO> getAllDepartures(Integer first, Integer last);

    Page<DepartureDTO> getAllMyDepartures(Integer first, Integer last, CustomUserDetails principal);

    DepartureDTO getDepartureById(Long id);

    DepartureDTO createDeparture(DepartureDTO departureDTO);

    DepartureDTO updateDeparture(Long id, DepartureDTO departureDTO);

    void deleteDeparture(Long id);

    boolean checkTicketAvailable(DepartureDTO departureDTO, SeatDTO seatDTO);

    List<DepartureCardDTO> getFilteredDepartures(Long startStationId, Long endStationId, LocalDate date, Integer passenger);
}
