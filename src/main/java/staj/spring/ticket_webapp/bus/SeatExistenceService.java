package staj.spring.ticket_webapp.bus;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.departure.DepartureRepository;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.seat.Seat;
import staj.spring.ticket_webapp.seat.SeatDTO;
import staj.spring.ticket_webapp.seat.SeatMapper;
import staj.spring.ticket_webapp.seat.SeatRepository;
import staj.spring.ticket_webapp.ticket.TicketRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatExistenceService {
    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;
    private final TicketRepository ticketRepository;
    private final DepartureRepository departureRepository;

    void createSeatsForBus(Bus bus){
        for(int i=1;i <= bus.getCapacity(); i++) { //create seat for capacity
            seatRepository.save(seatMapper.seatDtoToSeat((SeatDTO.builder()
                    .seatNum(i)
                    .busId(bus.getId()).build())));
        }
    }

    void updateSeatsForBus(Bus bus){
        Seat seat = seatRepository.findFirstByBusIdOrderBySeatNumDesc(bus.getId());

        if (seat.getSeatNum() < bus.getCapacity()){
            for(int i=seat.getSeatNum()+1; i <= bus.getCapacity(); i++) { //create seat for increased capacity
                seatRepository.save(seatMapper.seatDtoToSeat((SeatDTO.builder()
                        .seatNum(i)
                        .busId(bus.getId()).build())));
            }
        } else if (seat.getSeatNum() > bus.getCapacity()) {
            seatRepository.deleteAllByBusIdEqualsAndSeatNumAfter(bus.getId(), bus.getCapacity());
        }
    }

    void deleteSeatsForBus(Long busId){
        if (departureRepository.existsDepartureByBus_Id(busId))
            for (var a : departureRepository.getAllByBusId(busId)) {
                if (!ticketRepository.getAllByDepartureId(a.getId()).isEmpty()) {
                    throw new LogicException("Bus cannot be deleted, ticket already exists");
                }
            }

        if (seatRepository.findAllByBusId(busId) != null) //do not delete if ticket exists
            seatRepository.deleteAllByBusIdEquals(busId);
    }

}
