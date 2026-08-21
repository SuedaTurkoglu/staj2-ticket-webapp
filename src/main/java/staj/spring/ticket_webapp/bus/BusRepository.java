package staj.spring.ticket_webapp.bus;

import staj.spring.ticket_webapp.base.BaseRepository;

import java.util.List;
import java.util.Optional;

public interface BusRepository extends BaseRepository<Bus> {
    Optional<Bus> findByPlate(String plate);
}

