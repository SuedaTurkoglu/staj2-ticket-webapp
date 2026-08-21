package staj.spring.ticket_webapp.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO extends BaseDTO {
    private Long userId;
    private String name;
    private String surname;
    private String mail;
    private Boolean admin;
    private Boolean driver;
}
