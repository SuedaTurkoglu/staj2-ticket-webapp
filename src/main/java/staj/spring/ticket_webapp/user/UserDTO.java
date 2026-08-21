package staj.spring.ticket_webapp.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import staj.spring.ticket_webapp.base.BaseDTO;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO extends BaseDTO {
    @NotNull(message = "Name is required.")
    private String name;
    @NotNull(message = "Surname is required.")
    private String surname;
    @NotBlank(message = "Mail is required.")
    private String mail;
    @NotBlank(message = "Password is required.")
    private String password;
    private Boolean admin;
    private Boolean driver;
}
