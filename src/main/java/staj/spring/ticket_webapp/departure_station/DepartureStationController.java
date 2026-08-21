package staj.spring.ticket_webapp.departure_station;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/departure-station")
public class DepartureStationController {
    private final DepartureStationService departureStationService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DepartureStationDTO>> getListDepartureStations(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(departureStationService.getAllDepartureStations(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DepartureStationDTO>> getListDepartureStations(@RequestParam("first") Integer first, @RequestParam("last") Integer last){
        return ResponseEntity.ok(departureStationService.getAllDepartureStations(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureStationDTO> getDepartureStationById(@PathVariable("id") Long id){
        return ResponseEntity.ok(departureStationService.getDepartureStationById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureStationDTO> createDepartureStation(@RequestBody @Valid DepartureStationDTO departureStationDTO){
        DepartureStationDTO created = departureStationService.createDepartureStation(departureStationDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureStationDTO> updateDepartureStation(@PathVariable("id") Long id, @RequestBody @Valid DepartureStationDTO departureStationDTO){
        DepartureStationDTO updated = departureStationService.updateDepartureStation(id, departureStationDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureStationDTO> deleteDepartureStation(@PathVariable("id") Long id){
        departureStationService.deleteDepartureStation(id);

        return ResponseEntity.noContent().build();
    }

}
