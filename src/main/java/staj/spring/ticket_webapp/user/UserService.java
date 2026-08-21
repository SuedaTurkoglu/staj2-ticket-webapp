package staj.spring.ticket_webapp.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> getAllUsers(Pageable pageable);

    Page<UserResponseDTO> getAllUsers(Integer first, Integer last);

    UserDTO getUserById(Long id);

    UserDTO createUser(UserDTO userDTO);

    UserResponseDTO updateUser(Long id, UserResponseDTO userResponseDTO);

    UserResponseDTO updateUserFromProfile(Long id, UserResponseDTO userResponseDTO);

    void deleteUser(Long id);
}
