package com.lostandfound.LostAndFound.reward.repo;

import com.lostandfound.LostAndFound.reward.entities.RewardData;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardDataRepository extends MongoRepository<RewardData, String> {
  /**
   * Find a reward data by its id
   *
   * @param id id of the reward data
   * @return Optional<RewardData> reward data
   */
  Optional<RewardData> findById(String id);
}
