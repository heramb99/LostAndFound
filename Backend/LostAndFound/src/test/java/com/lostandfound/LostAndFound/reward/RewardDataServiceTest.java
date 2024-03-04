package com.lostandfound.LostAndFound.reward;

import static org.mockito.Mockito.when;

import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.reward.entities.RewardData;
import com.lostandfound.LostAndFound.reward.repo.RewardDataRepository;
import com.lostandfound.LostAndFound.reward.service.Impl.RewardDataServiceImpl;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RewardDataServiceTest {
  RewardData rewardData;
  String otherRewardId = "100";
  @Mock private RewardDataRepository rewardDataRepository;
  @InjectMocks private RewardDataServiceImpl rewardDataService;

  @BeforeEach
  public void setUp() {
    rewardData = new RewardData("123", "Reward test", "Reward description test", "TEST123");
  }

  @Test
  void testCreateRewardData() {
    // arrange
    when(rewardDataRepository.save(rewardData)).thenReturn(rewardData);

    // act
    RewardData createdRewardData = rewardDataService.create(rewardData);

    // assert
    Assertions.assertEquals(rewardData, createdRewardData);
  }

  @Test
  void testCreateRewardDataException() {
    // arrange
    when(rewardDataRepository.save(rewardData)).thenThrow(new LostAndFoundException(""));

    // act
    // assert
    Assertions.assertThrows(
        LostAndFoundException.class, () -> rewardDataService.create(rewardData));
    // check message
    Assertions.assertEquals(
        "Error while creating reward data",
        Assertions.assertThrows(
                LostAndFoundException.class, () -> rewardDataService.create(rewardData))
            .getMessage());
  }

  @Test
  void testFindRewardDataById() {
    // arrange
    when(rewardDataRepository.findById("123")).thenReturn(Optional.ofNullable(rewardData));

    // act
    RewardData foundRewardData = rewardDataService.findById("123");

    // assert
    Assertions.assertEquals(rewardData.getId(), foundRewardData.getId());
    Assertions.assertEquals(rewardData.getTitle(), foundRewardData.getTitle());
    Assertions.assertEquals(rewardData.getDescription(), foundRewardData.getDescription());
    Assertions.assertEquals(rewardData.getCode(), foundRewardData.getCode());
  }

  @Test
  void testFindRewardDataByIdNotFoundException() {
    when(rewardDataRepository.findById(otherRewardId)).thenReturn(Optional.empty());

    RewardData otherRewardData = rewardData.copy();
    otherRewardData.setId(otherRewardId);
    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> rewardDataService.findById(otherRewardData.getId()));
    Assertions.assertEquals(
        "Reward data not found",
        Assertions.assertThrows(
                LostAndFoundNotFoundException.class,
                () -> rewardDataService.findById(otherRewardData.getId()))
            .getMessage());
  }

  @Test
  void testGetAllIds() {
    RewardData otherReward = rewardData.copy();
    otherReward.setId(otherRewardId);
    // arrange
    when(rewardDataRepository.findAll()).thenReturn(List.of(rewardData, otherReward));

    // act
    List<String> foundRewardDataList = rewardDataService.getAllIds();

    // assert
    Assertions.assertEquals(rewardData.getId(), foundRewardDataList.get(0));
    Assertions.assertEquals(otherReward.getId(), foundRewardDataList.get(1));
  }
}
