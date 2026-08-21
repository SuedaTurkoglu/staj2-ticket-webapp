package staj.spring.ticket_webapp.station;

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
@RequestMapping("/api/station")
public class StationController {
    private final StationService stationService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StationDTO>> getListStations(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(stationService.getAllStations(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    public ResponseEntity<Page<StationDTO>> getListStations(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(stationService.getAllStations(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDTO> getStationById(@PathVariable("id") Long id){
        return ResponseEntity.ok(stationService.getStationById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDTO> createStation(@RequestBody @Valid StationDTO stationDTO){
        StationDTO created = stationService.createStation(stationDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDTO> updateStation(@PathVariable("id") Long id, @RequestBody @Valid StationDTO stationDTO){
        StationDTO updated = stationService.updateStation(id, stationDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDTO> deleteStation(@PathVariable("id") Long id){
        stationService.deleteStation(id);

        return ResponseEntity.noContent().build();
    }

}
