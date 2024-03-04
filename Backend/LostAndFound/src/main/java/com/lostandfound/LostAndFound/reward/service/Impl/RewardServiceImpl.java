package com.lostandfound.LostAndFound.reward.service.Impl;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.reward.entities.Reward;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardRepository;
import com.lostandfound.LostAndFound.reward.service.RewardDataService;
import com.lostandfound.LostAndFound.reward.service.RewardService;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RewardServiceImpl implements RewardService {

  @Autowired private RewardRepository rewardRepository;

  @Autowired private RewardDataService rewardDataService;

  private final int VALIDITY = 30;

  /**
   * Create a new reward
   *
   * @param reward the object of the reward
   * @return the created reward
   */
  @Override
  public Reward create(Reward reward) {
    // get all the rewards id from the database
    List<String> allRewardIds = rewardDataService.getAllIds();

    // get random id for the reward
    String rewardId;
    Random rand = new Random();
    int randomIndex = rand.nextInt(allRewardIds.size());
    rewardId = allRewardIds.get(randomIndex);

    RewardData rewardData = rewardDataService.findById(rewardId);

    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.DATE, VALIDITY);
    Date expiryDate = new Date(cal.getTime().getTime());

    reward.setRewardData(rewardData);
    reward.setExpiryDate(expiryDate);

    return this.rewardRepository.save(reward);
  }

  /**
   * Get a reward by winner id
   *
   * @param winnerId id of the winner
   * @return the reward list
   */
  @Override
  public List<Reward> findAllByWinnerId(String winnerId) {
    return this.rewardRepository.findAllByWinnerId(winnerId);
  }

  /**
   * Give reward to the winner
   *
   * @param lostItemUserId id of the lost item user
   * @param lostItemId id of the lost item
   * @param item stored item
   */
  @Override
  public void giveReward(String lostItemUserId, String lostItemId, Item item) {
    Reward reward = new Reward();

    reward.setWinnerId(item.getCreatedBy());
    reward.setLostItemUserId(lostItemUserId);
    reward.setLostItemId(lostItemId);
    reward.setItemId(item.getId());
    reward.setItemTitle(item.getTitle());

    this.create(reward);
  }
}
