package com.lostandfound.LostAndFound.reward.service.Impl;

import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardDataRepository;
import com.lostandfound.LostAndFound.reward.service.RewardDataService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RewardDataServiceImpl implements RewardDataService {

  @Autowired private RewardDataRepository rewardDataRepository;

  /**
   * Create a new reward data
   *
   * @param rewardData data of the reward (contains the details of the reward)
   * @return the created reward data
   * @throws LostAndFoundException if the reward data does not exist
   */
  @Override
  public RewardData create(RewardData rewardData) {
    try {
      return this.rewardDataRepository.save(rewardData);
    } catch (Exception e) {
      throw new LostAndFoundException("Error while creating reward data");
    }
  }

  /**
   * Get a reward data by its id
   *
   * @param id id of the reward data
   * @return the reward data
   * @throws LostAndFoundNotFoundException if the reward data does not exist
   */
  @Override
  public RewardData findById(String id) {
    Optional<RewardData> rewardDataOptional = this.rewardDataRepository.findById(id);

    if (rewardDataOptional.isEmpty()) {
      throw new LostAndFoundNotFoundException("Reward data not found");
    }
    return rewardDataOptional.get();
  }

  /**
   * Get all reward data ids
   *
   * @return the ids of all reward data
   */
  @Override
  public List<String> getAllIds() {
    List<RewardData> rewardDataList = this.rewardDataRepository.findAll();
    return rewardDataList.stream().map(RewardData::getId).toList();
  }
}
