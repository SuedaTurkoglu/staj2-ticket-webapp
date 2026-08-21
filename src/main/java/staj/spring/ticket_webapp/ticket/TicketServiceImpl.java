package staj.spring.ticket_webapp.ticket;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.departure.TicketingService;
import staj.spring.ticket_webapp.departure_station.DepartureStation;
import staj.spring.ticket_webapp.departure_station.DepartureStationRepository;
import staj.spring.ticket_webapp.departure_station.DepartureStationService;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.seat.SeatRepository;
import staj.spring.ticket_webapp.station.StationMapper;
import staj.spring.ticket_webapp.station.StationRepository;
import staj.spring.ticket_webapp.user.User;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService{
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final DepartureStationService departureStationService;
    private final DepartureStationRepository departureStationRepository;
    private final TicketingService ticketingService;
    private final SeatRepository seatRepository;
    private final StationRepository stationRepository;
    private final StationMapper stationMapper;

    @Override
    public Page<TicketDTO> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(ticketMapper::ticketToTicketDto);
    }

    @Override
    public Page<TicketCardDTO> getAllTickets(Integer first, Integer last) {
        return ticketRepository.findAll(OffsetBasedPageRequest.createPageable(first, last))
                .map(ticketMapper::ticketToTicketDto)
                .map(this::toTicketCardDTO);
    }

    @Override
    public Page<TicketCardDTO> getAllMyTickets(Integer first, Integer last, CustomUserDetails principal) {
        User user = principal.getUserEntity();

        return ticketRepository.findAllByUserId(user.getId(), OffsetBasedPageRequest.createPageable(first, last))
                .map(ticketMapper::ticketToTicketDto)
                .map(this::toTicketCardDTO);
    }

    private TicketCardDTO toTicketCardDTO(TicketDTO ticketDTO) {
        return TicketCardDTO.builder()
                .ticketId(ticketDTO.getId())
                .startDate(departureStationRepository.getReferenceById(ticketDTO.getDepartureStationStartId()).getDate())
                .priceCalculated(ticketDTO.getPriceCalculated())
                .seatNum(seatRepository.getReferenceById(ticketDTO.getSeatId()).getSeatNum())
                .stationTimes(getRouteList(ticketDTO))
                .passengerTckn(ticketDTO.getPassengerTckn())
                .passengerName(ticketDTO.getPassengerName())
                .passengerSurname(ticketDTO.getPassengerSurname())
                .build();
    }

    private List<StationTimeEntryDTO> getRouteList(TicketDTO ticketDTO) {

        List<DepartureStation> departureStationList = departureStationRepository.findAllByDepartureId(ticketDTO.getDepartureId());

        Integer startOrderInDeparture = departureStationRepository.getReferenceById(ticketDTO.getDepartureStationStartId()).getOrderInRoute();
        Integer endOrderInDeparture = departureStationRepository.getReferenceById(ticketDTO.getDepartureStationEndId()).getOrderInRoute();

        List<DepartureStation> stationsBetweenInDeparture = departureStationList.stream().filter(
                station -> station.getOrderInRoute() >= startOrderInDeparture &&
                        station.getOrderInRoute() <= endOrderInDeparture)
                        .sorted(Comparator.comparingInt(DepartureStation::getOrderInRoute)) //just in case
                        .toList();

        return stationsBetweenInDeparture.stream()
                .map(st -> StationTimeEntryDTO.builder()
                        .station(stationMapper.stationToStationDto(stationRepository.getReferenceById(st.getStationId())))
                        .time(st.getTime())
                        .build())
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public TicketDTO getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(ticketMapper::ticketToTicketDto)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found with id: " + id));
    }

    @Override
    public TicketDTO createTicket(TicketDTO ticketDTO, User user) {
        //ids come as station, replacing with departureStation ids
        Long startStationId = departureStationRepository.findByDepartureIdAndStationId(ticketDTO.getDepartureId(), ticketDTO.getDepartureStationStartId()).getId();
        Long endStationId = departureStationRepository.findByDepartureIdAndStationId(ticketDTO.getDepartureId(), ticketDTO.getDepartureStationEndId()).getId();

        validateStations(startStationId, endStationId);
        int priceCalculated = ticketingService.calculatePriceForTicket(ticketDTO.getDepartureId(),
                                    ticketDTO.getDepartureStationStartId(), ticketDTO.getDepartureStationEndId());

        TicketDTO created = TicketDTO.builder()
                .priceCalculated(priceCalculated)
                .seatId(ticketDTO.getSeatId())
                .departureId(ticketDTO.getDepartureId())
                .departureStationStartId(startStationId)
                .departureStationEndId(endStationId)
                .passengerTckn(ticketDTO.getPassengerTckn())
                .passengerName(ticketDTO.getPassengerName())
                .passengerSurname(ticketDTO.getPassengerSurname())
                .userId(user.getId()).build();

        Ticket saved = ticketRepository.save(ticketMapper.ticketDtoToTicket(created));

        return ticketMapper.ticketToTicketDto(saved);
    }

    private void validateStations(Long startId, Long endId){
        if(departureStationService.getDepartureStationById(startId).getOrderInRoute() >= departureStationService.getDepartureStationById(endId).getOrderInRoute())
            throw new LogicException("End station cannot be earlier than start station assigned in route.");

        if(!departureStationService.getDepartureStationById(startId).getDepartureId().equals(departureStationService.getDepartureStationById(endId).getDepartureId()))
            throw new LogicException("Ticket cannot be created, stations must be on the same route.");
    }

    @Override
    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO) {
        validateStations(ticketDTO.getDepartureStationStartId(), ticketDTO.getDepartureStationEndId());

        ticketRepository.save(ticketMapper.ticketDtoToTicket(ticketDTO));

        return getTicketById(id);
    }

    @Override
    public void deleteTicket(Long id) {
        if (ticketRepository.existsById(id))
            ticketRepository.deleteById(id);
        else
            throw new EntityNotFoundException("Ticket does not exist with id: " + id);
    }

    @Override
    public boolean existsByDepartureIdAndSeatId(Long departureId, Long seatId){
        return ticketRepository.existsByDepartureIdAndSeatId(departureId, seatId);
    }


}
