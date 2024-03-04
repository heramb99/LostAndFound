package com.lostandfound.LostAndFound.user.rest;

import com.lostandfound.LostAndFound.user.entities.User;
import com.lostandfound.LostAndFound.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/user")
public class UserController {

  @Autowired private UserService userService;

  // Get user by email
  @GetMapping
  public User getUserByEmail(@RequestParam(required = true) String email) {
    return userService.findByEmail(email);
  }

  @PostMapping
  public User addUser(@RequestBody User user) {
    return userService.insert(user);
  }

  @DeleteMapping
  public void deleteUser(@RequestParam(required = true) String email) {
    userService.delete(email);
  }

  @PutMapping
  public User update(@RequestBody User user) {
    return userService.update(user);
  }
}
