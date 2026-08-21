package staj.spring.ticket_webapp.user;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import staj.spring.ticket_webapp.base.OffsetBasedPageRequest;
import staj.spring.ticket_webapp.exception.LogicException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;/////////

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::userToUserDto);
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(Integer first, Integer last) { //not sending the password to frontend
        return userRepository.findAll(OffsetBasedPageRequest.createPageable(first, last)).map(userMapper::userToUserResponseDto);
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::userToUserDto)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if(userRepository.findByMail(userDTO.getMail()).isPresent())
            throw new LogicException("User with this mail already exists");

        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());

        UserDTO created = UserDTO.builder()
                .name(userDTO.getName())
                .surname(userDTO.getSurname())
                .mail(userDTO.getMail())
                .password(hashedPassword)
                //changed to false after implementing security constraints,
                //an admin or driver can only be given this role by existing admin
                .admin(false)
                .driver(false).build();

        User saved = userRepository.save(userMapper.userDtoToUser(created));

        return userMapper.userToUserDto(saved);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserResponseDTO userResponseDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new LogicException("User could not be found. Try again later."));

        user.setName(userResponseDTO.getName());
        user.setSurname(userResponseDTO.getSurname());
        user.setMail(userResponseDTO.getMail());
        user.setAdmin(userResponseDTO.getAdmin());
        user.setDriver(userResponseDTO.getDriver());

        User updatedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .userId(updatedUser.getId())
                .name(updatedUser.getName())
                .surname(updatedUser.getSurname())
                .mail(updatedUser.getMail())
                .admin(updatedUser.getAdmin())
                .driver(updatedUser.getDriver())
                .build();
    }

    @Override
    public UserResponseDTO updateUserFromProfile(Long id, UserResponseDTO userResponseDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new LogicException("User could not be found. Try again later."));

        user.setName(userResponseDTO.getName());
        user.setSurname(userResponseDTO.getSurname());

        User updatedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .userId(updatedUser.getId())
                .name(updatedUser.getName())
                .surname(updatedUser.getSurname())
                .mail(updatedUser.getMail())
                .admin(updatedUser.getAdmin())
                .driver(updatedUser.getDriver())
                .build();
    }

    @Override
    public void deleteUser(Long id) {
        if (userRepository.existsById(id))
            userRepository.deleteById(id);
        else
            throw new EntityNotFoundException("User does not exist with id: " + id);
    }

}
