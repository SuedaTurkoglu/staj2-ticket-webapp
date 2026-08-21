package staj.spring.ticket_webapp.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import staj.spring.ticket_webapp.base.BaseEntity;
import staj.spring.ticket_webapp.departure.Departure;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "app_user", uniqueConstraints = @UniqueConstraint(columnNames = "mail"))
public class User extends BaseEntity {

    @Column(nullable = false)
    @NotBlank
    @Size(min = 3)
    private String name;

    @Column(nullable = false)
    @NotBlank
    @Size(min = 3)
    private String surname;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Email
    private String mail;

    @Column(nullable = false)
    @NotBlank
    @Size(min = 8)
    private String password;

    @Column(nullable = false)
    private Boolean admin;

    @Column(nullable = false)
    private Boolean driver;

    @OneToMany(mappedBy = "driver")
    private Set<Departure> departureSet;
}
