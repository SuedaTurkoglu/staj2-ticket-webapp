package staj.spring.ticket_webapp.station;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class StationDTO extends BaseDTO {
    @NotBlank
    private String city;
    @NotBlank
    private String district;
    @NotBlank
    @Pattern(regexp = "^-?\\d+(\\.\\d+)?,\\s*-?\\d+(\\.\\d+)?$", message = "Bad coordinate value")
    private String coordinate;
}
