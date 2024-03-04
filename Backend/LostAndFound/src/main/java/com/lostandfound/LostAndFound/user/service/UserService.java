package com.lostandfound.LostAndFound.user.service;

import com.lostandfound.LostAndFound.user.entities.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

  /**
   * This method will check if the user already exists with given email.
   *
   * @param email
   * @return
   */
  User findByEmail(String email);

  /**
   * This method will create new user in db.
   *
   * @param user
   * @return
   */
  User insert(User user);

  /**
   * This method will delete the user if exists.
   *
   * @param email
   */
  void delete(String email);

  /**
   * This method will update the user if exists.
   *
   * @param user
   * @return
   */
  User update(User user);
}
