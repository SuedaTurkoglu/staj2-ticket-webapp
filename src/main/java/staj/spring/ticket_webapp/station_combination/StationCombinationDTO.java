package staj.spring.ticket_webapp.station_combination;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

import java.time.LocalTime;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class StationCombinationDTO extends BaseDTO {
    @NotNull
    private Long stationAId;
    @NotNull
    private Long stationBId;
    @Positive
    private Integer distance;
    @Positive
    private Integer duration;

}
