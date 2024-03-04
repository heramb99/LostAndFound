package com.lostandfound.LostAndFound.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostandfound.LostAndFound.user.entities.User;
import com.lostandfound.LostAndFound.user.repo.UserRepository;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest
public class UserIntegrationTest {
  User user;

  @Value("${auth.token}")
  String bearerToken;

  @Autowired private MockMvc mockMvc;
  @Autowired private UserRepository userRepository;
  @Autowired private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    user = new User("test@email.com", "testuser", "https://google.com", new Date(), new Date());
  }

  @AfterEach
  public void cleanUp() {
    this.userRepository.deleteAll();
  }

  @Test
  void testGetUserSuccess() throws Exception {
    // arrange
    this.userRepository.save(user);

    // act + assert
    mockMvc
        .perform(get("/user?email=" + user.getEmail()))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(user.getEmail()));
  }

  @Test
  void testGetUserNotExists() throws Exception {
    // arrange

    // act + assert
    mockMvc.perform(get("/user?email=" + user.getEmail())).andExpect(status().isNotFound());
  }

  @Test
  void testAddUserSuccess() throws Exception {
    // arrange

    // act
    mockMvc
        .perform(
            post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
        .andExpect(status().isOk());

    // assert
    Optional<User> insertedUser = this.userRepository.findById(user.getEmail());
    assertTrue(insertedUser.isPresent());
  }

  @Test
  void testAddUserAlreadyExists() throws Exception {
    // arrange
    this.userRepository.save(user);

    // act + assert
    mockMvc
        .perform(
            post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
        .andExpect(status().is4xxClientError());
  }

  @Test
  void testDeleteUserSuccess() throws Exception {
    // arrange
    this.userRepository.save(user);

    // act + assert
    mockMvc
        .perform(
            delete("/user?email=" + user.getEmail())
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk());
    Optional<User> deletedUser = this.userRepository.findByEmail(user.getEmail());
    assertTrue(deletedUser.isEmpty());
  }

  @Test
  void testDeleteUserNotExists() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            delete("/user?email=" + user.getEmail())
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testUpdateUserSuccess() throws Exception {
    // arrange
    this.userRepository.save(user);
    user.setName("newName");

    // act + assert
    mockMvc
        .perform(
            put("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk());
    Optional<User> updatedUserOptional = this.userRepository.findByEmail(user.getEmail());
    assertEquals(user.getName(), updatedUserOptional.get().getName());
  }

  @Test
  void testUpdateUserNotExists() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            put("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testUpdateUserCanNotUpdateEmail() throws Exception {
    // arrange
    this.userRepository.save(user);
    user.setEmail("newemail@gmail.com");

    // act + assert
    mockMvc
        .perform(
            put("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().is4xxClientError());
  }
}
