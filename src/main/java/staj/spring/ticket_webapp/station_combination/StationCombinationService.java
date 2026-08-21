package staj.spring.ticket_webapp.station_combination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StationCombinationService {

    Page<StationCombinationDTO> getAllStationCombinations(Pageable pageable);

    Page<StationCombinationDTO> getAllStationCombinations(Integer first, Integer last);

    StationCombinationDTO getStationCombinationById(Long id);

    StationCombinationDTO createStationCombination(StationCombinationDTO stationCombinationDTO);

    StationCombinationDTO updateStationCombination(Long id, StationCombinationDTO stationCombinationDTO);

    void deleteStationCombination(Long id);

    Integer getDistanceBetween(Long stationAId, Long stationBId);

    Integer getDurationBetween(Long stationAId, Long stationBId);
}
