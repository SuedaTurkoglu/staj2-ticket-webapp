package staj.spring.ticket_webapp.seat;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.station.StationCombinationDeletionService;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService{
    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;

    @Override
    public Page<SeatDTO> getAllSeats(Pageable pageable) {
        return seatRepository.findAll(pageable).map(seatMapper::seatToSeatDto);
    }

    @Override
    public Page<SeatDTO> getAllSeats(Integer first, Integer last) {
        return seatRepository.findAll(OffsetBasedPageRequest.createPageable(first, last)).map(seatMapper::seatToSeatDto);
    }

    @Override
    public SeatDTO getSeatById(Long id) {
        return seatRepository.findById(id)
                .map(seatMapper::seatToSeatDto)
                .orElseThrow(() -> new EntityNotFoundException("Seat not found with id: " + id));
    }

    @Override
    public SeatDTO getSeatBySeatNumAndBusId(Integer seatNum, Long busId) {
        return seatMapper.seatToSeatDto(seatRepository.findBySeatNumAndBusId(seatNum, busId));
    }

    @Override
    public SeatDTO createSeat(SeatDTO seatDTO) {
        SeatDTO created = SeatDTO.builder()
                .seatNum(seatDTO.getSeatNum())
                .busId(seatDTO.getBusId()).build();

        Seat saved = seatRepository.save(seatMapper.seatDtoToSeat(created));

        return seatMapper.seatToSeatDto(saved);
    }

    private void checkSeatExists(Long seatId, int seatNum){
        Seat seat = seatRepository.getReferenceById(seatId);

        if(seat.getBus().getCapacity() < seatNum)
            throw new LogicException("This seat is not available");
    }

    @Override
    public SeatDTO updateSeat(Long id, SeatDTO seatDTO) {
        checkSeatExists(id, seatDTO.getSeatNum());

        seatRepository.save(seatMapper.seatDtoToSeat(seatDTO));

        return getSeatById(id);
    }

    @Override
    public void deleteSeat(Long id) {
        if (seatRepository.existsById(id)){
            seatRepository.deleteById(id);
        }
        else
            throw new EntityNotFoundException("Seat does not exist with id: " + id);
    }
}
