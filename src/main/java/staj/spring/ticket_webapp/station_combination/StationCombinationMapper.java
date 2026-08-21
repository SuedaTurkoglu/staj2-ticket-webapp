package staj.spring.ticket_webapp.station_combination;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StationCombinationMapper {
    StationCombination stationCombinationDtoToStationCombination(StationCombinationDTO stationCombinationDTO);
    StationCombinationDTO stationCombinationToStationCombinationDto(StationCombination stationCombination);
}
