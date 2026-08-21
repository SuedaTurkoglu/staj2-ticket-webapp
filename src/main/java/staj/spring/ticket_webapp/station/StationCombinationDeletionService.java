package staj.spring.ticket_webapp.station;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.station_combination.StationCombinationRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class StationCombinationDeletionService {
    private final StationCombinationRepository stationCombinationRepository;

//    void deleteStationCombinationForStation(Long stationId) {
//        if (stationCombinationRepository.findByStationAIdOrStationBId(stationId, stationId))
//            stationCombinationRepository.deleteAllByStationAIdOrStationBId(stationId, stationId);
//    }

}
