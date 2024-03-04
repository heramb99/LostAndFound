package com.lostandfound.LostAndFound.user.repo;

import com.lostandfound.LostAndFound.user.entities.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

  Optional<User> findByEmail(String email);

  Boolean existsByEmail(String email);

  void deleteByEmail(String email);
}
