package staj.spring.ticket_webapp.ticket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import staj.spring.ticket_webapp.base.BaseRepository;

import java.nio.channels.FileChannel;
import java.util.List;

public interface TicketRepository extends BaseRepository<Ticket> {

    boolean existsByDepartureIdAndSeatId(Long departureId, Long seatId);

    List<Ticket> getAllByDepartureId(Long departureId);

    Page<Ticket> findAllByUserId(Long userId, Pageable pageable);
}
