package staj.spring.ticket_webapp.ticket;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import staj.spring.ticket_webapp.user.User;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ticket")
public class TicketController {
    private final TicketService ticketService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TicketDTO>> getListTickets(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(ticketService.getAllTickets(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TicketCardDTO>> getListTickets(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(ticketService.getAllTickets(first, last));
    }

    @RequestMapping(value = "/load-my-tickets", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TicketCardDTO>> getAllMyTickets(@RequestParam("first") Integer first, @RequestParam("last")Integer last,
                                                               @AuthenticationPrincipal CustomUserDetails principal){
        return ResponseEntity.ok(ticketService.getAllMyTickets(first, last, principal));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable("id") Long id){
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDTO> createTicket(@RequestBody @Valid TicketDTO ticketDTO,
                                                  @AuthenticationPrincipal CustomUserDetails principal){
        User authUser = principal.getUserEntity();

        TicketDTO created = ticketService.createTicket(ticketDTO, authUser);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketDTO> updateTicket(@PathVariable("id") Long id, @RequestBody @Valid TicketDTO ticketDTO){
        TicketDTO updated = ticketService.updateTicket(id, ticketDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketDTO> deleteTicket(@PathVariable("id") Long id){
        ticketService.deleteTicket(id);

        return ResponseEntity.noContent().build();
    }

}
