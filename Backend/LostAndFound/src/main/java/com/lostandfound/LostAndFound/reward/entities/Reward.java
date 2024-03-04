package com.lostandfound.LostAndFound.reward.entities;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "reward")
public class Reward {
  @Id private String id;
  private RewardData rewardData;
  private String lostItemUserId;
  private String itemId;
  private String itemTitle;
  private String lostItemId;
  private String winnerId; // founder of the item
  @CreatedDate private Date issuedAt;
  private Date expiryDate;
}
