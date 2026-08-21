package staj.spring.ticket_webapp.departure;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartureMapper {
    DepartureDTO departureToDepartureDto(Departure departure);
    Departure departureDtoToDeparture(DepartureDTO departureDTO);
}
