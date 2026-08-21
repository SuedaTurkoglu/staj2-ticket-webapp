package staj.spring.ticket_webapp.seat;

import jakarta.validation.constraints.NotBlank;
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
public class SeatDTO extends BaseDTO {
    @Positive
    private Integer seatNum;
    @NotNull(message = "Bus is required.")
    private Long busId;
}
