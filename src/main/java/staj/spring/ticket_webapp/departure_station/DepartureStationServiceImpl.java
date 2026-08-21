package staj.spring.ticket_webapp.departure_station;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartureStationServiceImpl implements DepartureStationService{
    private final DepartureStationRepository departureStationRepository;
    private final DepartureStationMapper departureStationMapper;

    @Override
    public Page<DepartureStationDTO> getAllDepartureStations(Pageable pageable) {
        return departureStationRepository.findAll(pageable).map(departureStationMapper::departureStationToDepartureStationDto);
    }

    @Override
    public Page<DepartureStationDTO> getAllDepartureStations(Integer first, Integer last) {
        return departureStationRepository.findAll(OffsetBasedPageRequest.createPageable(first, last))
                .map(departureStationMapper::departureStationToDepartureStationDto);
    }

    @Override
    public DepartureStationDTO getDepartureStationById(Long id) {
        return departureStationRepository.findById(id)
                .map(departureStationMapper::departureStationToDepartureStationDto)
                .orElseThrow(() -> new EntityNotFoundException("Departure Station not found with id: " + id));
    }

    @Override
    public DepartureStationDTO createDepartureStation(DepartureStationDTO departureStationDTO) {
        DepartureStationDTO created = DepartureStationDTO.builder()
                .stationId(departureStationDTO.getStationId())
                .departureId(departureStationDTO.getDepartureId())
                .orderInRoute(departureStationDTO.getOrderInRoute())
                .date(departureStationDTO.getDate())
                .time(departureStationDTO.getTime()).build();

        DepartureStation saved = departureStationRepository.save(departureStationMapper.departureStationDtoToDepartureStation(created));

        return departureStationMapper.departureStationToDepartureStationDto(saved);
    }

    @Override
    public DepartureStationDTO updateDepartureStation(Long id, DepartureStationDTO departureStationDTO) {

        departureStationRepository.save(departureStationMapper.departureStationDtoToDepartureStation(departureStationDTO));

        return getDepartureStationById(id);
    }

    @Override
    public void deleteDepartureStation(Long id) {
        if (departureStationRepository.existsById(id)) {
            departureStationRepository.deleteById(id);
        }
        else
            throw new EntityNotFoundException("Departure Station does not exist with id: " + id);
    }

    @Override
    public List<DepartureStationDTO> getDepartureStationByDepartureId(Long departureId){
        return departureStationRepository.findAllByDepartureIdOrderByOrderInRouteAsc(departureId)
                .stream()
                .map(departureStationMapper::departureStationToDepartureStationDto)
                .toList();
    }

}
