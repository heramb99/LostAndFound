package com.lostandfound.LostAndFound.reward.service;

import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import java.util.List;

public interface RewardDataService {
  /**
   * Create a new reward data
   *
   * @param rewardData data of the reward (contains the details of the reward)
   * @return the created reward data
   */
  RewardData create(RewardData rewardData);

  /**
   * Get a reward data by its id
   *
   * @param id id of the reward data
   * @return the reward data
   * @throws LostAndFoundNotFoundException if the reward data does not exist
   */
  RewardData findById(String id);

  /**
   * Get all reward data ids
   *
   * @return the ids of all reward data
   */
  List<String> getAllIds();
}
