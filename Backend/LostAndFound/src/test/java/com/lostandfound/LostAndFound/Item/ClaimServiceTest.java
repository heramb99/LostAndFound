package com.lostandfound.LostAndFound.Item;

import static org.mockito.Mockito.when;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import com.lostandfound.LostAndFound.Item.service.impl.ClaimServiceImpl;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundValidationException;
import com.lostandfound.LostAndFound.reward.service.RewardService;
import java.util.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

@ExtendWith(MockitoExtension.class)
public class ClaimServiceTest {
  private final String USER_ID = "testuser@gmail.com";
  private final Double LONGITUDE = 12.123;
  private final Double LATITUDE = 12.123;
  Item foundItem;
  Item lostItem;
  Date date = new Calendar.Builder().setDate(2023, 11, 2).build().getTime();
  @Mock private ItemRepository itemRepository;
  @Mock private RewardService rewardService;
  @InjectMocks private ClaimServiceImpl claimService;

  @BeforeEach
  void setUp() {
    foundItem = new Item();
    foundItem.setId("123");
    foundItem.setTitle("iPhone 12");
    foundItem.setDescription("Black iPhone 12");
    foundItem.setCreatedBy("test@gmail.com");
    foundItem.setSensitive(false);
    foundItem.setPostedAt(date);
    foundItem.setUpdatedDate(date);
    foundItem.setImage(new ArrayList<>());
    foundItem.setFoundItem(false);
    foundItem.setCategory("Electronics");
    foundItem.setClaimRequested(new HashMap<>());
    foundItem.setClaimRequestAccepted(new HashMap<>());
    foundItem.setClaimRejected(new HashMap<>());
    foundItem.setLocation(new GeoJsonPoint(LONGITUDE, LATITUDE));

    lostItem = new Item();
    lostItem.setId("1a2b3c");
    lostItem.setTitle("iPhone 12");
    lostItem.setDescription("Black Color iPhone 12");
    lostItem.setCreatedBy("losttest@gmail.com");
    lostItem.setSensitive(false);
    lostItem.setPostedAt(date);
    lostItem.setUpdatedDate(date);
    lostItem.setImage(new ArrayList<>());
    lostItem.setFoundItem(false);
    lostItem.setCategory("Electronics");
    lostItem.setClaimRequested(new HashMap<>());
    lostItem.setClaimRequestAccepted(new HashMap<>());
    lostItem.setClaimRejected(new HashMap<>());
    lostItem.setLocation(new GeoJsonPoint(LONGITUDE, LATITUDE));
  }

  @Test
  public void testClaimRequestedSuccessful() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    // act
    claimService.updateClaimRequest(lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());

    // assert
    Assertions.assertTrue(foundItem.getClaimRequested().containsValue(lostItem.getCreatedBy()));
  }

  @Test
  public void testClaimRequestedItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Item does not exists");
  }

  @Test
  public void testClaimRequestedLostItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Lost item does not exists");
  }

  @Test
  public void testClaimRequestedItemPostedByUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              foundItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "You can not raise claim request for item posted by you.");
  }

  @Test
  public void testClaimRequestedItemPostedByClaimRequestUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));
    String claimRequestUserId = "claim@gmail.com";

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(claimRequestUserId, foundItem.getId(), lostItem.getId());
        },
        "You can not raise claim request for item that you have not lost.");
  }

  @Test
  public void testClaimRequestedAlreadyAccepted() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());
    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Your claim request has already been accepted for this item.");
  }

  @Test
  public void testClaimRequestedAlreadyRejected() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    foundItem.getClaimRejected().put(lostItem.getId(), lostItem.getCreatedBy());
    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Your claim request has already been rejected for this item.");
  }

  @Test
  public void testClaimRequestedItemAlreadyRequested() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "You have already raised claim request for this item.");
  }

  @Test
  public void testClaimRequestedItemAlreadyClaimed() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    foundItem.setClaimedBy("claimed@gmail.com");

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Item is already claimed by someone.");
  }

  @Test
  public void testClaimRequestedItemAlreadyClaimedAccepted() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.findById(lostItem.getId())).thenReturn(Optional.of(lostItem));

    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequest(
              lostItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "Your claim request has already been accepted for this item.");
  }

  @Test
  public void testClaimRequestAcceptedSuccessful() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    foundItem.getClaimRequested().put(lostItem.getCreatedBy(), lostItem.getId());
    // act
    claimService.updateClaimRequestAccepted(
        foundItem.getCreatedBy(), foundItem.getId(), lostItem.getCreatedBy());

    // assert
    Assertions.assertTrue(foundItem.getClaimRequestAccepted().containsKey(lostItem.getCreatedBy()));
  }

  @Test
  public void testClaimRequestAcceptedItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item does not exists");
  }

  @Test
  public void testClaimRequestAcceptedItemAlreadyClaimed() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    foundItem.setClaimedBy("claimed@gmail.com");

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item is already claimed by someone.");
  }

  @Test
  public void testClaimRequestAcceptedItemPostedByUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              foundItem.getCreatedBy(), foundItem.getId(), lostItem.getCreatedBy());
        },
        "You can not accept claim request for item posted by other user.");
  }

  @Test
  public void testClaimRequestAcceptedItemPostedByClaimRequestUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    HashMap<String, String> claimRequested = new HashMap<>();
    claimRequested.put(lostItem.getId(), foundItem.getCreatedBy());
    foundItem.setClaimRequested(claimRequested);
    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              foundItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "You can not accept claim request for item posted by you.");
  }

  @Test
  public void testClaimRequestAcceptedItemClaimRequestNotYetRaised() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "User has not raised claim request for this item.");
  }

  @Test
  public void testClaimRequestAcceptedItemClaimRequestAlreadyAccepted() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.updateClaimRequestAccepted(
              foundItem.getCreatedBy(), foundItem.getId(), lostItem.getId());
        },
        "You have already accepted claim request for this user.");
  }

  @Test
  public void testRevokeClaimRequestSuccessful() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());

    // act
    claimService.revokeClaimRequest(lostItem.getCreatedBy(), foundItem.getId());

    // assert
    Assertions.assertFalse(foundItem.getClaimRequested().containsValue(lostItem.getCreatedBy()));
  }

  @Test
  public void testRevokeClaimRequestItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.revokeClaimRequest(lostItem.getCreatedBy(), foundItem.getId());
        },
        "Item does not exists");
  }

  @Test
  public void testRevokeClaimRequestItemClaimRequestNotYetRaised() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.revokeClaimRequest(USER_ID, foundItem.getId());
        },
        "User has not raised claim request for this item.");
  }

  @Test
  public void testApproveClaimSuccessful() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());

    // act
    claimService.approveClaim(foundItem.getCreatedBy(), foundItem.getId(), lostItem.getCreatedBy());

    // assert
    Assertions.assertEquals(foundItem.getClaimedBy(), lostItem.getCreatedBy());
  }

  @Test
  public void testApproveClaimItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.approveClaim(USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item does not exists");
  }

  @Test
  public void testApproveClaimItemAlreadyClaimed() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    foundItem.setClaimedBy("testclaimapprove@gmail.com");

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.approveClaim(USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item is already claimed by someone.");
  }

  @Test
  public void testApproveClaimItemPostedByUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.approveClaim(USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "You can not approve claim request for item posted by other user.");
  }

  @Test
  public void testApproveClaimItemPostedByClaimRequestUser() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.approveClaim(
              foundItem.getCreatedBy(), foundItem.getId(), foundItem.getCreatedBy());
        },
        "You yourself cannot be the item founder and claimant.");
  }

  @Test
  public void testApproveClaimItemClaimRequestNotYetAccepted() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.approveClaim(
              foundItem.getCreatedBy(), foundItem.getId(), lostItem.getCreatedBy());
        },
        "User has not raised claim request for this item.");
  }

  @Test
  public void testRejectClaimSuccessful() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());

    // act
    claimService.rejectClaim(foundItem.getCreatedBy(), foundItem.getId(), lostItem.getCreatedBy());

    // assert
    Assertions.assertTrue(foundItem.getClaimRejected().containsValue(lostItem.getCreatedBy()));
  }

  @Test
  public void testRejectClaimItemNotFound() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          claimService.rejectClaim(USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item does not exists");
  }

  @Test
  public void testRejectClaimItemAlreadyRejected() {
    // arrange
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    foundItem.getClaimRejected().put(lostItem.getId(), lostItem.getCreatedBy());

    // act + assert
    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          claimService.rejectClaim(USER_ID, foundItem.getId(), lostItem.getCreatedBy());
        },
        "User's claim request has already been rejected for this item.");
  }
}
