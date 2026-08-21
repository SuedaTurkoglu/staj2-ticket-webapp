package staj.spring.ticket_webapp.seat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SeatService {

    Page<SeatDTO> getAllSeats(Pageable pageable);

    Page<SeatDTO> getAllSeats(Integer first, Integer last);

    SeatDTO getSeatById(Long id);

    SeatDTO getSeatBySeatNumAndBusId(Integer seatNum, Long busId);

    SeatDTO createSeat(SeatDTO seatDTO);

    SeatDTO updateSeat(Long id, SeatDTO seatDTO);

    void deleteSeat(Long id);
}
