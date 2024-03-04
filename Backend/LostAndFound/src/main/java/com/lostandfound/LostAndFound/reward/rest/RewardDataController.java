package com.lostandfound.LostAndFound.reward.rest;

import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.service.RewardDataService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reward/data")
public class RewardDataController {
  @Autowired private RewardDataService rewardDataService;

  @PostMapping("/create")
  public RewardData create(@RequestBody RewardData rewardData) {
    return this.rewardDataService.create(rewardData);
  }

  @GetMapping("/{id}")
  public RewardData findById(@PathVariable String id) {
    return this.rewardDataService.findById(id);
  }

  @GetMapping("/all")
  public List<String> getAllIds() {
    return this.rewardDataService.getAllIds();
  }
}
