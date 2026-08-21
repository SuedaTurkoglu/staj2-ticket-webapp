package staj.spring.ticket_webapp.ticket;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    Ticket ticketDtoToTicket(TicketDTO ticketDTO);
    TicketDTO ticketToTicketDto(Ticket ticket);
}
