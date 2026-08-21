package staj.spring.ticket_webapp.bus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BusService {

    Page<BusDTO> getAllBuses(Pageable pageable);

    Page<BusDTO> getAllBuses(Integer first, Integer last);

    BusDTO getBusById(Long id);

    BusDTO createBus(BusDTO busDTO);

    BusDTO updateBus(Long id, BusDTO busDTO);

    void deleteBus(Long id);

    BusDTO getBusByPlate(String plate);
}
