package staj.spring.ticket_webapp.station_combination;

import staj.spring.ticket_webapp.base.BaseRepository;

import java.util.List;

public interface StationCombinationRepository extends BaseRepository<StationCombination> {
    StationCombination findByStationAIdAndStationBId(Long stationAId, Long stationBId);

    StationCombination findByStationAIdOrStationBId(Long stationAId, Long stationBId);

    void deleteAllByStationAIdOrStationBId(Long stationAId, Long stationBId);

}
