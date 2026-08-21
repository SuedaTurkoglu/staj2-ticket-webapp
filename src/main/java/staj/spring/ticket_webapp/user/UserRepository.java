package staj.spring.ticket_webapp.user;

import staj.spring.ticket_webapp.base.BaseRepository;
import java.util.Optional;

public interface UserRepository extends BaseRepository<User> {

    Optional<User> findByMail(String mail);
}
