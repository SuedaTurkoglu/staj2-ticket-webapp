package staj.spring.ticket_webapp.bus;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.seat.SeatDTO;

@Service
@RequiredArgsConstructor
public class    BusServiceImpl implements BusService{
    private final BusMapper busMapper;
    private final BusRepository busRepository;
    private final SeatExistenceService seatExistenceService;

    @Override
    public Page<BusDTO> getAllBuses(Pageable pageable) {
        return busRepository.findAll(pageable).map(busMapper::busToBusDto);
    }

    @Override
    public Page<BusDTO> getAllBuses(Integer first, Integer last) {
        return busRepository.findAll(OffsetBasedPageRequest.createPageable(first, last)).map(busMapper::busToBusDto);
    }

    @Override
    public BusDTO getBusById(Long id) {
        return busRepository.findById(id)
                .map(busMapper::busToBusDto)
                .orElseThrow(() -> new EntityNotFoundException("Bus not found with id: " + id));
    }

    private String checkPlate(String plate) {
        String regex = "(?<=\\d)(?=[a-zA-Z])|(?<=[a-zA-Z])(?=\\d)"; // add space between number and char if not in proper format

        return plate.toUpperCase().replaceAll(regex, " ");
    }

    @Override
    public BusDTO createBus(BusDTO busDTO) {
        BusDTO created =BusDTO.builder()
                .plate(checkPlate(busDTO.getPlate()))
                .capacity(busDTO.getCapacity()).build();

        Bus saved = busRepository.save(busMapper.busDtoToBus(created));

        seatExistenceService.createSeatsForBus(saved);

        return busMapper.busToBusDto(saved);
    }

    @Override
    public BusDTO updateBus(Long id, BusDTO busDTO) {
        busDTO.setPlate(checkPlate(busDTO.getPlate()));

        Bus updated = busRepository.save(busMapper.busDtoToBus(busDTO));

        seatExistenceService.updateSeatsForBus(updated);

        return getBusById(id);
    }

    @Override
    public void deleteBus(Long id) {
        if (busRepository.existsById(id)) {
            seatExistenceService.deleteSeatsForBus(id);
            busRepository.deleteById(id);
        }
        else
            throw new EntityNotFoundException("Bus does not exist with id: " + id);
    }

    @Override
    public BusDTO getBusByPlate(String plate) {
        return busRepository.findByPlate(plate)
                .map(busMapper::busToBusDto)
                .orElseThrow(() -> new EntityNotFoundException("Bus not found with plate: " + plate));
    }
}
