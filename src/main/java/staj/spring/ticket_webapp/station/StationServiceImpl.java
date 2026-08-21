package staj.spring.ticket_webapp.station;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.departure_station.DepartureStationRepository;
import staj.spring.ticket_webapp.exception.LogicException;

@Service
@RequiredArgsConstructor
public class StationServiceImpl implements StationService{
    private final StationRepository stationRepository;
    private final StationMapper stationMapper;
    private final DepartureStationRepository departureStationRepository;
    private final StationCombinationDeletionService stationCombinationDeletionService;

    @Override
    public Page<StationDTO> getAllStations(Pageable pageable) {
        return stationRepository.findAll(pageable).map(stationMapper::stationToStationDto);
    }

    @Override
    public Page<StationDTO> getAllStations(Integer first, Integer last) {
        return stationRepository.findAll(OffsetBasedPageRequest.createPageable(first, last)).map(stationMapper::stationToStationDto);
    }

    @Override
    public StationDTO getStationById(Long id) {
        return stationRepository.findById(id)
                .map(stationMapper::stationToStationDto)
                .orElseThrow(() -> new EntityNotFoundException("Station not found with id: " + id));
    }

    @Override
    public StationDTO createStation(StationDTO stationDTO) {
        StationDTO created = StationDTO.builder()
                .city(stationDTO.getCity())
                .district(stationDTO.getDistrict())
                .coordinate(stationDTO.getCoordinate()).build();

        Station saved = stationRepository.save(stationMapper.stationDtoToStation(created));

        return stationMapper.stationToStationDto(saved);
    }

    @Override
    public StationDTO updateStation(Long id, StationDTO stationDTO) {

        stationRepository.save(stationMapper.stationDtoToStation(stationDTO));

        return getStationById(id);
    }

    @Override
    public void deleteStation(Long id) {
        if (stationRepository.existsById(id)) {
            if (!departureStationRepository.findAllByStationId(id).isEmpty()){
                throw new LogicException("Cannot delete this station. There are related departures exist.");
            } else {
                //station combinations stays in the db
//                stationCombinationDeletionService.deleteStationCombinationForStation(id);
                stationRepository.deleteById(id);
            }
        } else
            throw new EntityNotFoundException("Station does not exist with id: " + id);
    }

}
