package staj.spring.ticket_webapp.departure_station;

import staj.spring.ticket_webapp.base.BaseRepository;

import java.util.List;

public interface DepartureStationRepository extends BaseRepository<DepartureStation> {
    List<DepartureStation> findAllByDepartureIdOrderByOrderInRouteAsc(Long DepartureId);

    List<DepartureStation> findAllByStationId(Long stationId);

    List<DepartureStation> findAllByDepartureId(Long departureId);

    void deleteAllByDepartureId(Long departureId);

    DepartureStation findByDepartureIdAndStationId(Long departureId, Long stationId);

    DepartureStation findByDepartureIdAndOrderInRoute(Long departureId, Integer orderInRoute);
    
    DepartureStation getFirstByDepartureIdOrderByOrderInRouteAsc(Long departureId);

    void deleteAllByDepartureIdAndOrderInRouteGreaterThan(Long departureId, Integer orderInRouteIsGreaterThan);
}
