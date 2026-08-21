package staj.spring.ticket_webapp.departure;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.bus.BusService;
import staj.spring.ticket_webapp.departure_station.DepartureStationDTO;
import staj.spring.ticket_webapp.departure_station.DepartureStationRepository;
import staj.spring.ticket_webapp.departure_station.DepartureStationService;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.station_combination.StationCombinationService;
import staj.spring.ticket_webapp.ticket.Ticket;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TicketingServiceImpl implements TicketingService {
    private final DepartureRepository departureRepository;
    private final DepartureStationService departureStationService;
    private final StationCombinationService stationCombinationService;
    private final DepartureStationRepository departureStationRepository;
    private final BusService busService;

    @Override
    public Integer[] calculatePrice(Long departureId, Long startStationId, Long endStationId) {
        Integer basePrice = departureRepository.getReferenceById(departureId).getBasePrice();
        Integer pricePerKm = departureRepository.getReferenceById(departureId).getPricePerKm();

        List<DepartureStationDTO> stationListOfDeparture = departureStationService.getDepartureStationByDepartureId(departureId);

        Integer startOrderInDeparture = departureStationRepository.findByDepartureIdAndStationId(departureId, startStationId).getOrderInRoute();
        Integer endOrderInDeparture = departureStationRepository.findByDepartureIdAndStationId(departureId, endStationId).getOrderInRoute();
        validateStations(startOrderInDeparture, endOrderInDeparture);

        List<DepartureStationDTO> stationsBetweenInDeparture = new ArrayList<>(stationListOfDeparture.stream().filter(
                station -> station.getOrderInRoute() >= startOrderInDeparture &&
                        station.getOrderInRoute() <= endOrderInDeparture)
                        .toList());

        Integer totalDistance = 0;
        Integer duration = 0;

        for (int i=0;i<stationsBetweenInDeparture.size()-1;i++){
            totalDistance += stationCombinationService.getDistanceBetween(stationsBetweenInDeparture.get(i).getStationId(),
                                                                        stationsBetweenInDeparture.get(i+1).getStationId());
            duration += stationCombinationService.getDurationBetween(stationsBetweenInDeparture.get(i).getStationId(),
                    stationsBetweenInDeparture.get(i+1).getStationId());
        }

        return new Integer[]{totalDistance, (basePrice + totalDistance*pricePerKm), duration};
    }

    private void validateStations(Integer startOrder, Integer endOrder){
        if(startOrder >= endOrder)
            throw new LogicException("End station cannot be earlier than start station assigned in route.");
    }

    @Override
    public Integer calculatePriceForTicket(Long departureId, Long startStationId, Long endStationId) {
        Integer basePrice = departureRepository.getReferenceById(departureId).getBasePrice();
        Integer pricePerKm = departureRepository.getReferenceById(departureId).getPricePerKm();

        List<DepartureStationDTO> stationListOfDeparture = departureStationService.getDepartureStationByDepartureId(departureId);

        Integer startOrderInDeparture = departureStationRepository.findByDepartureIdAndStationId(departureId, startStationId).getOrderInRoute();
        Integer endOrderInDeparture = departureStationRepository.findByDepartureIdAndStationId(departureId, endStationId).getOrderInRoute();
        validateStations(startOrderInDeparture, endOrderInDeparture);

        List<DepartureStationDTO> stationsBetweenInDeparture = new ArrayList<>(stationListOfDeparture.stream().filter(
                        station -> station.getOrderInRoute() >= startOrderInDeparture &&
                                station.getOrderInRoute() <= endOrderInDeparture)
                                .toList());

        Integer totalDistance = 0;

        for (int i=0;i<stationsBetweenInDeparture.size()-1;i++){
            totalDistance += stationCombinationService.getDistanceBetween(stationsBetweenInDeparture.get(i).getStationId(),
                    stationsBetweenInDeparture.get(i+1).getStationId());
        }

        return(basePrice + totalDistance*pricePerKm);
    }

    @Override
    public LocalTime[] calculateTime(Long departureId, Long startStationId, Long endStationId) {
        LocalTime startTime = departureStationRepository.findByDepartureIdAndStationId(departureId, startStationId).getTime();
        LocalTime endTime = departureStationRepository.findByDepartureIdAndStationId(departureId, endStationId).getTime();

        return new LocalTime[]{startTime, endTime};
    }

    @Override
    public LocalDate calculateStartDate(Long departureId, Long startStationId) {
        return departureStationRepository.findByDepartureIdAndStationId(departureId, startStationId).getDate();
    }

    @Override
    public Map<Integer, Boolean> getTicketListOfDeparture(Long departureId, Long startStationId, Long endStationId) {
        Map<Integer, Boolean> ticketMap = new HashMap<>(); //contains seatNum & isOccupied

        Departure dep = departureRepository.getReferenceById(departureId);

        int capacity = busService.getBusById(dep.getBusId()).getCapacity();

        Set<Ticket> ticketsOfDeparture = dep.getTicketSet();

        int startOrder = departureStationRepository.findByDepartureIdAndStationId(departureId, startStationId).getOrderInRoute();
        int endOrder = departureStationRepository.findByDepartureIdAndStationId(departureId, endStationId).getOrderInRoute();

        boolean isOccupied;
        for (int i=1; i<=capacity; i++) {
            isOccupied = false;
            for (Ticket ticket : ticketsOfDeparture) {

                if (!ticket.getSeat().getSeatNum().equals(i)) { // only considering tickets for this seat
                    continue;
                }

                //either ticket start or end station must be between start-end stations of the selected route
                // to be marked as occupied
                if ((ticket.getDepartureStationStart().getOrderInRoute() >= startOrder &&
                        ticket.getDepartureStationStart().getOrderInRoute() <= endOrder) ||
                        (ticket.getDepartureStationEnd().getOrderInRoute() >= startOrder &&
                            ticket.getDepartureStationEnd().getOrderInRoute() <= endOrder)) {
                    isOccupied = true;
                    break; // no need to check other tickets for this seat
                }
            }
            ticketMap.put(i, isOccupied);
        }
        return ticketMap;
    }

}
