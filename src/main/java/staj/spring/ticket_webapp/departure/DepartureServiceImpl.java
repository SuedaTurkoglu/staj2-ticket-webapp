package staj.spring.ticket_webapp.departure;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.authentication_helper.JwtService;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.bus.BusRepository;
import staj.spring.ticket_webapp.departure_station.DepartureStation;
import staj.spring.ticket_webapp.departure_station.DepartureStationDTO;
import staj.spring.ticket_webapp.departure_station.DepartureStationService;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.seat.SeatDTO;
import staj.spring.ticket_webapp.station.StationDTO;
import staj.spring.ticket_webapp.station.StationService;
import staj.spring.ticket_webapp.ticket.TicketRepository;
import staj.spring.ticket_webapp.user.User;
import staj.spring.ticket_webapp.user.UserRepository;
import staj.spring.ticket_webapp.user.UserService;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DepartureServiceImpl implements DepartureService{
    private final DepartureRepository departureRepository;
    private final DepartureMapper departureMapper;
    private final UserService userService;
    private final TicketRepository ticketRepository;
    private final StationService stationService;
    private final DepartureStationExistenceService departureStationExistenceService;
    private final DepartureStationService departureStationService;
    private final TicketingService ticketingService;
    private final BusRepository busRepository;
    private final UserRepository userRepository;

    @Override
    public Page<DepartureDTO> getAllDepartures(Pageable pageable) {
        Page<Departure> departurePage = departureRepository.findAll(pageable);

        List<Departure> departureList = departurePage.getContent();

        List<DepartureDTO> departureDTOList = departureList.stream().map(departureMapper::departureToDepartureDto).toList();

        for (int i=0; i<departurePage.getTotalElements(); i++){
            Departure dep = departureList.get(i);
            Set<DepartureStation> departureStationSet = dep.getDepartureStationSet(); //returns THIS departure's stations

            List<StationDTO> stations = new ArrayList<>();

            departureStationSet.stream()
                    .filter(data -> Objects.equals(data.getDepartureId(), dep.getId()))
                    .map(data ->
                    stations.add(stationService.getStationById(data.getStationId()))
            );

            departureDTOList.get(i).setStationList(stations);
        }

        return new PageImpl<>(departureDTOList);
    }

    @Override
    public Page<DepartureDTO> getAllDepartures(Integer first, Integer last) {
        Page<Departure> departurePage = departureRepository.findAll(OffsetBasedPageRequest.createPageable(first, last));

        List<Departure> departureList = departurePage.getContent();

        List<DepartureDTO> departureDTOList = departureList.stream().map(departureMapper::departureToDepartureDto).toList();

        for (int i=0; i<departurePage.getTotalElements(); i++){
            Departure dep = departureList.get(i);
            List<DepartureStationDTO> departureStationSet = departureStationService.getDepartureStationByDepartureId(dep.getId());
            List<StationDTO> stations = new ArrayList<>();

            departureStationSet.forEach(data ->
                    stations.add(stationService.getStationById(data.getStationId()))
            );
            departureDTOList.get(i).setStationList(stations);
        }

        return new PageImpl<>(departureDTOList);
    }

    private User getUserFromAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new LogicException("User is not authenticated, please log in");
        }

        String token = authHeader.substring(7); // remove "Bearer " prefix
        String userEmail = JwtService.extractUsername(token);

        return userRepository.findByMail(userEmail)
                .orElseThrow(() -> new LogicException("User cannot be found with this authentication, log in and try again"));
    }

    @Override
    public Page<DepartureDTO> getAllMyDepartures(Integer first, Integer last, CustomUserDetails principal) {
        User driver = principal.getUserEntity();

        Page<Departure> departurePage = departureRepository.findAllByDriverId(driver.getId(), OffsetBasedPageRequest.createPageable(first, last));

        List<Departure> departureList = departurePage.getContent();

        List<DepartureDTO> departureDTOList = departureList.stream().map(departureMapper::departureToDepartureDto).toList();

        for (int i=0; i<departurePage.getTotalElements(); i++){
            Departure dep = departureList.get(i);
            List<DepartureStationDTO> departureStationSet = departureStationService.getDepartureStationByDepartureId(dep.getId());
            List<StationDTO> stations = new ArrayList<>();

            departureStationSet.forEach(data ->
                    stations.add(stationService.getStationById(data.getStationId()))
            );
            departureDTOList.get(i).setStationList(stations);
        }

        return new PageImpl<>(departureDTOList);
    }

    @Override
    public DepartureDTO getDepartureById(Long id) {
        if (departureRepository.existsById(id))
            return departureRepository.findById(id)
                .map(departureMapper::departureToDepartureDto)
                .orElseThrow(() -> new EntityNotFoundException("Departure not found with id: " + id));
        throw new EntityNotFoundException("Departure does not exist with id: " + id);
    }

    @Override
    public DepartureDTO createDeparture(DepartureDTO departureDTO) {
        checkDriver(departureDTO.getDriverId());
        checkSameStationExists(departureDTO.getStationIds());

        DepartureDTO created = DepartureDTO.builder()
                .date(departureDTO.getDate())
                .time(departureDTO.getTime())
                .busId(departureDTO.getBusId())
                .driverId(departureDTO.getDriverId())
                .startStationId(departureDTO.getStartStationId())
                .endStationId(departureDTO.getEndStationId())
                .basePrice(departureDTO.getBasePrice())
                .pricePerKm(departureDTO.getPricePerKm()).build();

        Departure saved = departureRepository.save(departureMapper.departureDtoToDeparture(created));

        departureStationExistenceService.createDepartureStationFromDeparture(saved, departureDTO.getStationIds());

        return departureMapper.departureToDepartureDto(saved);
    }

    private void checkDriver(Long driverId) {
        if(!userService.getUserById(driverId).getDriver())
            throw new LogicException("This user cannot be assigned as a driver.");
    }

    private void checkIfModifiable(Long id) {
        LocalDate today = LocalDate.now();
        if(today.isAfter(getDepartureById(id).getDate()))
            throw new LogicException("Previous departures cannot be modified");

        if(!ticketRepository.getAllByDepartureId(id).isEmpty())
            throw new LogicException("Ticket exists, cannot modify this departure");
    }

    private void checkSameStationExists(Long[] stationIds) {
        if (stationIds == null) return;

        Set<Long> uniqueStationIds = new HashSet<>();
        for (Long id : stationIds) {
            if (!uniqueStationIds.add(id)) {
                throw new LogicException("Duplicate stations are not allowed in the same departure");
            }
        }
    }

    @Override
    public boolean checkTicketAvailable(DepartureDTO departureDTO, SeatDTO seatDTO){
        return ticketRepository.existsByDepartureIdAndSeatId(departureDTO.getId(), seatDTO.getId());
    }

    @Override
    public DepartureDTO updateDeparture(Long id, DepartureDTO departureDTO) {
        checkDriver(departureDTO.getDriverId());
        checkIfModifiable(id);
        checkSameStationExists(departureDTO.getStationIds());

        Departure updated = departureRepository.save(departureMapper.departureDtoToDeparture(departureDTO));

        departureStationExistenceService.updateDepartureStationFromDeparture(updated, departureDTO.getStationIds());

        return getDepartureById(id);
    }

    @Override
    public void deleteDeparture(Long id) {
        checkIfModifiable(id);

        departureStationExistenceService.deleteDepartureStationFromDeparture(id);
        departureRepository.deleteById(id);
    }

    @Override
    public List<DepartureCardDTO> getFilteredDepartures(Long startStationId, Long endStationId, LocalDate date, Integer passenger) {
        //get the cities outside of the loop
        String queryStartCity = stationService.getStationById(startStationId).getCity();
        String queryEndCity = stationService.getStationById(endStationId).getCity();

        return departureRepository.getDepartures(startStationId, endStationId, date, passenger)
                .stream()
                .map(departureMapper::departureToDepartureDto)
                .map(dep -> toDepartureCardDTO(dep, startStationId, endStationId, queryStartCity, queryEndCity))
                .toList();
    }

    private DepartureCardDTO toDepartureCardDTO(DepartureDTO dep, Long startStationId, Long endStationId, String queryStartCity, String queryEndCity) {
        Integer[] prop = ticketingService.calculatePrice(dep.getId(), startStationId, endStationId);
        LocalTime[] timeProp = ticketingService.calculateTime(dep.getId(), startStationId, endStationId);
        Map<Integer, Boolean> ticketMap = ticketingService.getTicketListOfDeparture(dep.getId(), startStationId, endStationId);

        return DepartureCardDTO.builder()
                .departureId(dep.getId())
                .queryStartDate(ticketingService.calculateStartDate(dep.getId(), startStationId))
                .queryStartStationName(queryStartCity)
                .queryEndStationName(queryEndCity)
                .startStationName(stationService.getStationById(dep.getStartStationId()).getCity())
                .endStationName(stationService.getStationById(dep.getEndStationId()).getCity())
                .seatLeft((int) ticketMap.values().stream().filter(Boolean.FALSE::equals).count())
                .queryDistance(prop[0])
                .queryPrice(prop[1])
                .queryDuration(prop[2])
                .queryStartTime(timeProp[0])
                .queryEndTime(timeProp[1])
                .busCapacity(busRepository.getReferenceById(dep.getBusId()).getCapacity())
                .seatMap(ticketMap)
                .build();
    }

}
