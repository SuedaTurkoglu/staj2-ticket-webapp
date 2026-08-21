package staj.spring.ticket_webapp.ticket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import staj.spring.ticket_webapp.user.User;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

public interface TicketService {

    Page<TicketDTO> getAllTickets(Pageable pageable);

    Page<TicketCardDTO> getAllTickets(Integer first, Integer last);

    Page<TicketCardDTO> getAllMyTickets(Integer first, Integer last, CustomUserDetails principal);

    TicketDTO getTicketById(Long id);

    TicketDTO createTicket(TicketDTO ticketDTO, User user);

    TicketDTO updateTicket(Long id, TicketDTO ticketDTO);

    void deleteTicket(Long id);

    boolean existsByDepartureIdAndSeatId(Long departureId, Long seatId);
}
