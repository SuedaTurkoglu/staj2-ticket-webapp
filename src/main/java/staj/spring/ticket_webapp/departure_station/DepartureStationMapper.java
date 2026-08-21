package staj.spring.ticket_webapp.departure_station;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartureStationMapper {
    DepartureStation departureStationDtoToDepartureStation(DepartureStationDTO departureStationDTO);
    DepartureStationDTO departureStationToDepartureStationDto(DepartureStation departureStation);
}
