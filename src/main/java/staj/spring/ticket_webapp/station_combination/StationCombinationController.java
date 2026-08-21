package staj.spring.ticket_webapp.station_combination;

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
@RequestMapping("/api/station-combination")
public class StationCombinationController {
    private final StationCombinationService stationCombinationService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StationCombinationDTO>> getListStationCombinations(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(stationCombinationService.getAllStationCombinations(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StationCombinationDTO>> getListStationCombinations(@RequestParam("first") Integer first, @RequestParam("last") Integer last){
        return ResponseEntity.ok(stationCombinationService.getAllStationCombinations(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationCombinationDTO> getStationCombinationById(@PathVariable("id") Long id){
        return ResponseEntity.ok(stationCombinationService.getStationCombinationById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationCombinationDTO> createStationCombination(@RequestBody @Valid StationCombinationDTO stationCombinationDTO){
        StationCombinationDTO created = stationCombinationService.createStationCombination(stationCombinationDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationCombinationDTO> updateStationCombination(@PathVariable("id") Long id, @RequestBody @Valid StationCombinationDTO stationCombinationDTO){
        StationCombinationDTO updated = stationCombinationService.updateStationCombination(id, stationCombinationDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationCombinationDTO> deleteStationCombination(@PathVariable("id") Long id){
        stationCombinationService.deleteStationCombination(id);

        return ResponseEntity.noContent().build();
    }

}
