package staj.spring.ticket_webapp.bus;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/bus")
public class BusController {
    private final BusService busService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BusDTO>> getListBuses(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(busService.getAllBuses(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BusDTO>> getListBusesWithOffset(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(busService.getAllBuses(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BusDTO> getBusById(@PathVariable("id") Long id){
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusDTO> createBus(@RequestBody @Valid BusDTO busDTO){
        BusDTO created = busService.createBus(busDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusDTO> updateBus(@PathVariable("id") Long id, @RequestBody @Valid BusDTO busDTO){
        BusDTO updated =  busService.updateBus(id, busDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusDTO> deleteBus(@PathVariable("id") Long id){
        busService.deleteBus(id);

        return ResponseEntity.noContent().build();
    }

}
