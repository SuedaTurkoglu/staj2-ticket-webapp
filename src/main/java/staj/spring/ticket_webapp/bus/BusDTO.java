package staj.spring.ticket_webapp.bus;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class BusDTO extends BaseDTO {
    @NotBlank
    @Pattern(regexp = "^(0[1-9]|[1-7][0-9]|8[0-1])\\s?[A-Za-z]{1,3}\\s?(\\d{2,4})$")
    private String plate;
    @Positive
    private Integer capacity;
}
