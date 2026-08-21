package staj.spring.ticket_webapp.departure_station;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DepartureStationService {

    Page<DepartureStationDTO> getAllDepartureStations(Pageable pageable);

    Page<DepartureStationDTO> getAllDepartureStations(Integer first, Integer last);

    DepartureStationDTO getDepartureStationById(Long id);

    DepartureStationDTO createDepartureStation(DepartureStationDTO departureStationDTO);

    DepartureStationDTO updateDepartureStation(Long id, DepartureStationDTO departureStationDTO);

    void deleteDepartureStation(Long id);

    List<DepartureStationDTO> getDepartureStationByDepartureId(Long departureId);
}
