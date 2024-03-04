package com.lostandfound.LostAndFound.reward.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "rewarddata")
public class RewardData {
  @Id private String id;
  private String title;
  private String description;
  private String code;

  public RewardData copy() {
    return new RewardData(this.id, this.title, this.description, this.code);
  }
}
