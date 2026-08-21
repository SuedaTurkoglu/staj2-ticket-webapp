package staj.spring.ticket_webapp.seat;

import staj.spring.ticket_webapp.base.BaseRepository;

import java.util.List;

public interface SeatRepository extends BaseRepository<Seat> {
    Seat findFirstByBusIdOrderBySeatNumDesc(Long busId);

    List<Seat> findAllByBusId(Long busId);
    
    Seat findBySeatNumAndBusId(Integer seatNum, Long busId);

    void deleteAllByBusIdEqualsAndSeatNumAfter(Long busId, Integer seatNumAfter);

    void deleteAllByBusIdEquals(Long busId);
}
