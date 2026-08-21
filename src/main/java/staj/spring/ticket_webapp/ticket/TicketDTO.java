package staj.spring.ticket_webapp.ticket;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO extends BaseDTO {
    @Positive
    private Integer priceCalculated;

    @NotNull(message = "Seat is required.")
    private Long seatId;

    @NotNull(message = "Departure is required.")
    private Long departureId;

    @NotNull(message = "Start station is required.")
    private Long departureStationStartId;

    @NotNull(message = "End station is required.")
    private Long departureStationEndId;

    @Column(length = 11)
    private Long passengerTckn;

    @NotBlank(message = "Passenger name is required.")
    private String passengerName;

    @NotBlank(message = "Passenger surname is required.")
    private String passengerSurname;

    @NotNull(message = "Buying from a logged in account is required.")
    private Long userId;
}
