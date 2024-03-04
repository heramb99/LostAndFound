package com.lostandfound.LostAndFound.reward;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardDataRepository;
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

@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest
public class RewardDataIntegrationTest {
  @Value("${auth.token}")
  String bearerToken;

  @Autowired private MockMvc mockMvc;
  @Autowired private RewardDataRepository rewardDataRepository;
  @Autowired private ObjectMapper objectMapper;

  private RewardData rewardData;

  @BeforeEach
  void setUp() {
    rewardData = new RewardData("123", "Reward Test", "Reward 20% off", "123456");
  }

  @AfterEach
  public void cleanUp() {
    this.rewardDataRepository.deleteAll();
  }

  @Test
  void testCreateRewardDataSuccess() throws Exception {
    this.mockMvc
        .perform(
            post("/reward/data/create")
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rewardData)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.id").isNotEmpty())
        .andExpect(jsonPath("$.id").value(rewardData.getId()))
        .andExpect(jsonPath("$.title").value(rewardData.getTitle()))
        .andExpect(jsonPath("$.description").value(rewardData.getDescription()))
        .andExpect(jsonPath("$.code").value(rewardData.getCode()));
  }

  @Test
  void testCreateRewardDataFailure() throws Exception {
    this.mockMvc
        .perform(
            post("/reward/data/create")
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testFindRewardDataByIdSuccess() throws Exception {
    // arrange
    this.rewardDataRepository.save(rewardData);

    // act + assert
    mockMvc
        .perform(
            get("/reward/data/" + rewardData.getId())
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rewardData)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.id").isNotEmpty())
        .andExpect(jsonPath("$.id").value(rewardData.getId()))
        .andExpect(jsonPath("$.title").value(rewardData.getTitle()))
        .andExpect(jsonPath("$.description").value(rewardData.getDescription()))
        .andExpect(jsonPath("$.code").value(rewardData.getCode()));
  }

  @Test
  void testFindRewardDataByIdNotFound() throws Exception {
    mockMvc
        .perform(
            get("/reward/data/" + rewardData.getId())
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rewardData)))
        .andExpect(status().isNotFound());
  }

  @Test
  void testGetAllRewardDataIdsSuccess() throws Exception {
    // arrange
    this.rewardDataRepository.save(rewardData);

    // act + assert
    mockMvc
        .perform(
            get("/reward/data/all")
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rewardData)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0]").exists())
        .andExpect(jsonPath("$[0]").isNotEmpty())
        .andExpect(jsonPath("$[0]").value(rewardData.getId()));
  }
}
