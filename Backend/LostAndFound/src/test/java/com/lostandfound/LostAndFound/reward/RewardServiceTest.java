package com.lostandfound.LostAndFound.reward;

import static org.mockito.Mockito.when;

import com.lostandfound.LostAndFound.reward.entities.Reward;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardRepository;
import com.lostandfound.LostAndFound.reward.service.Impl.RewardServiceImpl;
import com.lostandfound.LostAndFound.reward.service.RewardDataService;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RewardServiceTest {
  private final int VALIDITY = 30;
  private Reward reward;
  private RewardData rewardData;
  @Mock private RewardRepository rewardRepository;
  @Mock private RewardDataService rewardDataService;
  @InjectMocks private RewardServiceImpl rewardService;

  @BeforeEach
  public void setUp() {
    rewardData = new RewardData("123", "Reward test", "Reward description test", "TEST123");
    reward = new Reward();
    reward.setId("1");
    reward.setRewardData(rewardData);
    reward.setIssuedAt(Date.valueOf(LocalDate.now()));
    reward.setExpiryDate(Date.valueOf(LocalDate.now().plusDays(VALIDITY)));
    reward.setWinnerId("user1@dal.ca");
    reward.setLostItemUserId("lostuser1@dal.ca");
    reward.setItemId("item123");
    reward.setItemTitle("Item test");
  }

  @Test
  public void testCreateSuccess() {
    when(rewardRepository.save(reward)).thenReturn(reward);
    when(rewardDataService.getAllIds()).thenReturn(List.of(rewardData.getId()));
    Reward expectedReward = rewardService.create(reward);

    Assertions.assertEquals(expectedReward, reward);
  }

  @Test
  public void testFindAllByWinnerId() {
    when(rewardRepository.findAllByWinnerId(reward.getWinnerId())).thenReturn(List.of(reward));

    List<Reward> expectedReward = rewardService.findAllByWinnerId(reward.getWinnerId());

    Assertions.assertEquals(expectedReward, List.of(reward));
  }

  @Test
  public void testGiveRewardSuccess() {
    Reward customeReward = new Reward();
    customeReward.setWinnerId("user1@dal.ca");
    customeReward.setLostItemUserId("lostuser1@dal.ca");
    customeReward.setItemId("item123");
    customeReward.setItemTitle("Item test");

    when(rewardDataService.getAllIds()).thenReturn(List.of(rewardData.getId(), rewardData.getId()));
    when(rewardDataService.findById(rewardData.getId())).thenReturn(rewardData);

    rewardService.giveReward(
        customeReward.getWinnerId(),
        customeReward.getLostItemUserId(),
        customeReward.getLostItemId(),
        customeReward.getItemId(),
        customeReward.getItemTitle());

    Assertions.assertEquals(customeReward.getWinnerId(), reward.getWinnerId());
  }
}
