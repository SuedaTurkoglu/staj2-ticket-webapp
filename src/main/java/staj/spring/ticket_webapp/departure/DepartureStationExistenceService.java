package staj.spring.ticket_webapp.departure;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.departure_station.*;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.station_combination.StationCombinationService;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartureStationExistenceService {
    private final DepartureStationRepository departureStationRepository;
    private final DepartureStationMapper departureStationMapper;
    private final StationCombinationService stationCombinationService;

    void createDepartureStationFromDeparture(Departure departure, Long[] departureStationIds){
        if (departureStationIds.length == 0) throw new LogicException("Departure stations cannot be created");

        DepartureStation previousInRoute = null;

        for (int i = 1; i <=  departureStationIds.length; i++){
            DepartureStation departureStation;

            //if this is the first entry in the route, create with the date and time values of the departure
            if (i == 1) {
                departureStation = departureStationMapper.departureStationDtoToDepartureStation(
                        DepartureStationDTO.builder()
                                .stationId(departureStationIds[i-1])
                                .departureId(departure.getId())
                                .orderInRoute(i)
                                .date(departure.getDate())
                                .time(departure.getTime()).build()
                );

            } else { //calculate the date and time values, with respect to the previous station in the route

                int duration = stationCombinationService.getDurationBetween(departureStationIds[i-2], departureStationIds[i-1]);

                LocalDateTime dateTimeAdded =  LocalDateTime.of(previousInRoute.getDate(), previousInRoute.getTime()).plusMinutes(duration);
                departureStation = departureStationMapper.departureStationDtoToDepartureStation(
                        DepartureStationDTO.builder()
                                .stationId(departureStationIds[i-1])
                                .departureId(departure.getId())
                                .orderInRoute(i)
                                .date(dateTimeAdded.toLocalDate())
                                .time(dateTimeAdded.toLocalTime()).build()
                );
            }
            previousInRoute = departureStationRepository.save(departureStation);
        }
    }

    void updateDepartureStationFromDeparture(Departure departure, Long[] IDS) {
        if (IDS == null || IDS.length == 0) {
            throw new LogicException("Departure stations cannot be updated");
        }

        departureStationRepository.deleteAllByDepartureIdAndOrderInRouteGreaterThan(departure.getId(), IDS.length);
        departureStationRepository.flush();

        LocalDateTime currentDateTime = LocalDateTime.of(departure.getDate(), departure.getTime());

        for (int i = 1; i <= IDS.length; i++) {
            Long currentStationId = IDS[i - 1];

            if (i > 1) { // if not first station in route, update according to the previous station in route
                Long previousStationId = IDS[i - 2];
                //for the stations other than first index, calculate the duration with the previous station
                int duration = stationCombinationService.getDurationBetween(previousStationId, currentStationId);
                currentDateTime = currentDateTime.plusMinutes(duration);
            }
            DepartureStation updatingDS = departureStationRepository.findByDepartureIdAndOrderInRoute(departure.getId(), i);

            // update if index exist
            if(updatingDS != null) {
                updatingDS.setStationId(IDS[i - 1]);
                updatingDS.setDate(currentDateTime.toLocalDate());
                updatingDS.setTime(currentDateTime.toLocalTime());
                departureStationRepository.save(updatingDS);
            } else { // create if index was not existing
                DepartureStation departureStation = departureStationMapper.departureStationDtoToDepartureStation(
                        DepartureStationDTO.builder()
                                .stationId(IDS[i - 1])
                                .departureId(departure.getId())
                                .orderInRoute(i)
                                .date(currentDateTime.toLocalDate())
                                .time(currentDateTime.toLocalTime())
                                .build()
                );
                departureStationRepository.save(departureStation);
            }
        }
    }

    void deleteDepartureStationFromDeparture(Long departureId){
        if (!departureStationRepository.findAllByDepartureIdOrderByOrderInRouteAsc(departureId).isEmpty())
            departureStationRepository.deleteAllByDepartureId(departureId);
    }

}
