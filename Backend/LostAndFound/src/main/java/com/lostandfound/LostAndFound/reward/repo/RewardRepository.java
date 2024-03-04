package com.lostandfound.LostAndFound.reward.repo;

import com.lostandfound.LostAndFound.reward.entities.Reward;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends MongoRepository<Reward, String> {
  /**
   * Find all rewards by the winner id
   *
   * @param winnerId id of the winner
   * @return the reward list
   */
  public List<Reward> findAllByWinnerId(String winnerId);
}
