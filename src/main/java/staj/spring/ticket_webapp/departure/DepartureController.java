package staj.spring.ticket_webapp.departure;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/departure")
public class DepartureController {
    private final DepartureService departureService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DepartureDTO>> getListDepartures(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(departureService.getAllDepartures(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DepartureDTO>> getListDepartures(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(departureService.getAllDepartures(first, last));
    }

    @RequestMapping(value = "/load-my-departures", method = RequestMethod.GET)
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Page<DepartureDTO>> getListDepartures(@RequestParam("first") Integer first, @RequestParam("last")Integer last,
                                                                @AuthenticationPrincipal CustomUserDetails principal){
        return ResponseEntity.ok(departureService.getAllMyDepartures(first, last, principal));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepartureDTO> getDepartureById(@PathVariable("id") Long id){
        return ResponseEntity.ok(departureService.getDepartureById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureDTO> createDeparture(@RequestBody @Valid DepartureDTO departureDTO){
        return new ResponseEntity<>(departureService.createDeparture(departureDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureDTO> updateDeparture(@PathVariable("id") Long id, @RequestBody @Valid DepartureDTO departureDTO){
        return ResponseEntity.ok(departureService.updateDeparture(id, departureDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartureDTO> deleteDeparture(@PathVariable("id") Long id){
        departureService.deleteDeparture(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search") //public
    public ResponseEntity<List<DepartureCardDTO>> getListFilteredDepartures(@RequestParam("startStationId") Long startStationId, @RequestParam("endStationId") Long endStationId,
                                                                        @RequestParam("date") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date,
                                                                        @RequestParam("passenger") Integer passenger){
        return new ResponseEntity<>(departureService.getFilteredDepartures(startStationId, endStationId, date, passenger), HttpStatus.OK);
    }

}
