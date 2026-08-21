package staj.spring.ticket_webapp.station;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StationMapper {
    Station stationDtoToStation(StationDTO stationDTO);
    StationDTO stationToStationDto(Station station);
}
