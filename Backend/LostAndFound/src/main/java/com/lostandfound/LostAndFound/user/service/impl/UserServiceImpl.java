package com.lostandfound.LostAndFound.user.service.impl;

import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundValidationException;
import com.lostandfound.LostAndFound.user.entities.User;
import com.lostandfound.LostAndFound.user.repo.UserRepository;
import com.lostandfound.LostAndFound.user.service.UserService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

  @Autowired private UserRepository userRepository;

  @Override
  public User findByEmail(String email) {
    // check if user exists
    Optional<User> user = this.userRepository.findByEmail(email);
    if (!user.isPresent()) {
      throw new LostAndFoundNotFoundException("User does not exist");
    }
    return user.get();
  }

  @Override
  public User insert(User user) {
    if (this.userRepository.existsByEmail(user.getEmail())) {
      throw new LostAndFoundValidationException(
          "User already exists with email id: " + user.getEmail());
    }
    return this.userRepository.insert(user);
  }

  @Override
  public void delete(String email) {
    if (!this.userRepository.existsByEmail(email)) {
      throw new LostAndFoundNotFoundException("User does not exist.");
    }
    this.userRepository.deleteByEmail(email);
  }

  @Override
  public User update(User user) {
    if (!this.userRepository.existsByEmail(user.getEmail())) {
      throw new LostAndFoundNotFoundException("User does not exist.");
    }

    return this.userRepository.save(user);
  }
}
