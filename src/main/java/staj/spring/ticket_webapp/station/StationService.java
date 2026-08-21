package staj.spring.ticket_webapp.station;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StationService {

    Page<StationDTO> getAllStations(Pageable pageable);

    Page<StationDTO> getAllStations(Integer first, Integer last);

    StationDTO getStationById(Long id);

    StationDTO createStation(StationDTO stationDTO);

    StationDTO updateStation(Long id, StationDTO stationDTO);

    void deleteStation(Long id);
}
