package staj.spring.ticket_webapp.seat;

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
@RequestMapping("/api/seat")
public class SeatController {
    private final SeatService seatService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<SeatDTO>> getListSeats(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(seatService.getAllSeats(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<SeatDTO>> getListSeats(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(seatService.getAllSeats(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SeatDTO> getSeatById(@PathVariable("id") Long id){
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    @GetMapping(value = "/bus")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SeatDTO> getSeatBySeatNumAndBusId(@RequestParam("seatNum") Integer seatNum, @RequestParam("busId") Long busId){
        return ResponseEntity.ok(seatService.getSeatBySeatNumAndBusId(seatNum, busId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeatDTO> createSeat(@RequestBody @Valid SeatDTO seatDTO){
        SeatDTO created = seatService.createSeat(seatDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeatDTO> updateSeat(@PathVariable("id") Long id, @RequestBody @Valid SeatDTO seatDTO){
        SeatDTO updated = seatService.updateSeat(id, seatDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeatDTO> deleteSeat(@PathVariable("id") Long id){
        seatService.deleteSeat(id);

        return ResponseEntity.noContent().build();
    }

}
