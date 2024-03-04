package com.lostandfound.LostAndFound.reward;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostandfound.LostAndFound.reward.entities.Reward;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardDataRepository;
import com.lostandfound.LostAndFound.reward.repo.RewardRepository;
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
public class RewardIntegrationTest {
  @Value("${auth.token}")
  String bearerToken;

  @Autowired private MockMvc mockMvc;
  @Autowired private RewardRepository rewardRepository;
  @Autowired private RewardDataRepository rewardDataRepository;
  @Autowired private ObjectMapper objectMapper;

  private RewardData rewardData;
  private Reward reward;

  @BeforeEach
  void setUp() {
    rewardData = new RewardData("123", "Reward Test", "Reward 20% off", "123456");
    rewardDataRepository.save(rewardData);
    reward = new Reward();
    reward.setItemId("abc");
    reward.setLostItemId("def");
    reward.setLostItemUserId("lostitem@gmail.com");
    reward.setWinnerId("founder@gmail.com");
    reward.setItemTitle("Test Item");
  }

  @AfterEach
  public void cleanUp() {
    this.rewardDataRepository.deleteAll();
    this.rewardRepository.deleteAll();
  }

  @Test
  void testCreateReward() throws Exception {
    this.mockMvc
        .perform(
            post("/reward/create")
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rewardData)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.rewardData.id").exists())
        .andExpect(jsonPath("$.rewardData.id").isNotEmpty())
        .andExpect(jsonPath("$.rewardData.id").value(rewardData.getId()));
  }

  @Test
  void testFindByWinnerId() throws Exception {
    String winnerId = "founder1@gmail.com";
    reward.setWinnerId(winnerId);
    reward.setRewardData(rewardData);
    this.rewardRepository.save(reward);
    this.mockMvc
        .perform(
            get("/reward/all/" + winnerId)
                .header("Authorization", "Bearer " + bearerToken)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.[0].rewardData.id").value(rewardData.getId()))
        .andExpect(jsonPath("$.[0].winnerId").value(winnerId));
  }
}
