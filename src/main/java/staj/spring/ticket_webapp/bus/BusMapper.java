package staj.spring.ticket_webapp.bus;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BusMapper {
    Bus busDtoToBus(BusDTO busDTO);
    BusDTO busToBusDto(Bus bus);
}
