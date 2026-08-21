package staj.spring.ticket_webapp.seat;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    Seat seatDtoToSeat(SeatDTO seatDTO);
    SeatDTO seatToSeatDto(Seat seat);
}
