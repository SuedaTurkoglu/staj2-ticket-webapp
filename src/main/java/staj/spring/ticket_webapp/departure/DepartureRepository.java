package staj.spring.ticket_webapp.departure;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import staj.spring.ticket_webapp.base.BaseRepository;

import java.time.LocalDate;
import java.util.List;

public interface DepartureRepository extends BaseRepository<Departure> {

    @Query("select d " +
            "from Departure d " +
            "join d.departureStationSet ds_start " +
            "join d.departureStationSet ds_end " +
            "where ds_start.stationId = :startStationId " +
            "   and ds_start.date >= :startDate " +
            "   and ds_end.stationId = :endStationId " +
            "   and ds_end.orderInRoute > ds_start.orderInRoute" +

            "   and (d.bus.capacity - :passenger) >= ( select count(distinct t.seatId) " +
            "                                           from Ticket t " +
            "                                           where t.departureId = d.id " +
            "                                           and t.departureStationStart.orderInRoute < ds_end.orderInRoute " +
            "                                           and t.departureStationEnd.orderInRoute > ds_start.orderInRoute" +
            "                                          )"
            )
    List<Departure> getDepartures(@Param("startStationId") Long startStationId, @Param("endStationId") Long endStationId,
                                  @Param("startDate") LocalDate startDate, @Param("passenger") Integer passenger);

    Page<Departure> findAllByDriverId(Long driverId, Pageable pageable);

    boolean existsDepartureByBus_Id(Long busId);

    List<Departure> getAllByBusId(Long busId);
}
