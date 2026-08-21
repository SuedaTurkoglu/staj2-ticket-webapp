package staj.spring.ticket_webapp.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User userDtoToUser(UserDTO userDTO);
    UserDTO userToUserDto(User user);

    @Mapping(source = "id", target = "userId")
    UserResponseDTO userToUserResponseDto(User user);

    @Mapping(source = "id", target = "userId")
    UserResponseDTO userDtoToUserResponseDto(UserDTO userDTO);
}
