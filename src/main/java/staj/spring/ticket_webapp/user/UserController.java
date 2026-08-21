package staj.spring.ticket_webapp.user;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import staj.spring.ticket_webapp.authentication_helper.JwtService;
import staj.spring.ticket_webapp.exception.LogicException;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetails;
import staj.spring.ticket_webapp.user.custom_user.CustomUserDetailsService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user") //not getting user from auth, directly using SecurityContextHolder
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getListUsers(@PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable){
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponseDTO>> getListUsers(@RequestParam("first") Integer first, @RequestParam("last")Integer last){
        return ResponseEntity.ok(userService.getAllUsers(first, last));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserDTO userDTO){ //can return UserResponseDTO
        UserDTO created = userService.createUser(userDTO);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping(value =  "/login")
    public ResponseEntity<String> loginUser(@RequestBody @Valid UserDTO userDTO){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDTO.getMail(), userDTO.getPassword()));
        } catch (AuthenticationException ex) {
            throw new LogicException("The account with the entered credentials could not be found");
        }
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(userDTO.getMail());

        final String token = JwtService.generateToken(userDetails);

        return ResponseEntity.ok(token);
    }

    @GetMapping(value = "/current-user")
    @PreAuthorize("isAuthenticated()")
    //was receiving Authorization object but could not found a way to send the token directly, it is send by interceptor
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal CustomUserDetails principal){
        User authUser = principal.getUserEntity();

        UserResponseDTO userDetails = UserResponseDTO.builder()
                .userId(authUser.getId())
                .name(authUser.getName())
                .surname(authUser.getSurname())
                .mail(authUser.getMail())
                .admin(authUser.getAdmin())
                .driver(authUser.getDriver())
                .build();
        return ResponseEntity.ok(userDetails);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable("id") Long id, @RequestBody @Valid UserResponseDTO userResponseDTO){
        UserResponseDTO updated = userService.updateUser(id, userResponseDTO);

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/update-my-user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> updateUserFromProfile(@AuthenticationPrincipal CustomUserDetails principal, @RequestBody @Valid UserResponseDTO userResponseDTO){
        User authUser = principal.getUserEntity();

        UserResponseDTO updated = userService.updateUserFromProfile(authUser.getId(), userResponseDTO);

        return ResponseEntity.ok(updated);
    }

//    @PutMapping("/{id}/pw")
//    public ResponseEntity<UserDTO> changePassword(@PathVariable("id") Long id, @RequestBody @Valid UserDTO userDTO){
//        UserDTO updated = userService.(id, userDTO);
//
//        return ResponseEntity.ok(updated);
//    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable("id") Long id){
        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

}
