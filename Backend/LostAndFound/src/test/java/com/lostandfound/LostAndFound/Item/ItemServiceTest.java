package com.lostandfound.LostAndFound.Item;

import static org.mockito.Mockito.*;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import com.lostandfound.LostAndFound.Item.service.impl.ItemSeviceImpl;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
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
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

  private final Double LONGITUDE = 12.123;
  private final Double LATITUDE = 12.123;
  Date date = new Calendar.Builder().setDate(2023, 11, 2).build().getTime();
  private Item foundItem;
  private Item lostItem;
  @Mock private ItemRepository itemRepository;
  @Mock private RewardService rewardService;
  @Mock private MongoTemplate mongoTemplate;
  @InjectMocks private ItemSeviceImpl itemService;

  @BeforeEach
  public void setUp() {
    foundItem = new Item();
    foundItem.setId("123");
    foundItem.setTitle("iPhone 12");
    foundItem.setDescription("Black iPhone 12");
    foundItem.setCreatedBy("test@gmail.com");
    foundItem.setSensitive(false);
    foundItem.setPostedAt(date);
    foundItem.setUpdatedDate(date);
    foundItem.setImage(new ArrayList<>());
    foundItem.setFoundItem(true);
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
  public void testCreateItemSuccess() {
    when(itemRepository.save(foundItem)).thenReturn(foundItem);

    Item expectedItem = itemService.create(foundItem);

    Assertions.assertEquals(expectedItem, foundItem);
  }

  @Test
  public void testCreateItemFailure() {

    when(itemRepository.save(foundItem))
        .thenThrow(new LostAndFoundException("Error while posting new item."));

    Assertions.assertThrows(
        LostAndFoundException.class,
        () -> {
          itemService.create(foundItem);
        },
        "Error while posting new item.");
  }

  @Test
  public void testGetItemSuccess() {
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    Item expectedItem = itemService.getItem(foundItem.getId());

    Assertions.assertEquals(expectedItem, foundItem);
  }

  @Test
  public void testGetItemFailure() {
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          itemService.getItem(foundItem.getId());
        },
        "Item not found.");
  }

  @Test
  public void testUpdateItemSuccess() {
    when(itemRepository.existsById(foundItem.getId())).thenReturn(true);
    when(itemRepository.save(foundItem)).thenReturn(foundItem);

    Item expectedItem = itemService.update(foundItem);

    Assertions.assertEquals(expectedItem, foundItem);
  }

  @Test
  public void testUpdateItemNotFoundException() {
    when(itemRepository.existsById(foundItem.getId())).thenReturn(false);

    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          itemService.update(foundItem);
        },
        "Item with id does not exists");
  }

  @Test
  public void testUpdateItemFailure() {
    when(itemRepository.existsById(foundItem.getId())).thenReturn(true);
    when(itemRepository.save(foundItem))
        .thenThrow(new LostAndFoundException("Error while updating item."));

    Assertions.assertThrows(
        LostAndFoundException.class,
        () -> {
          itemService.update(foundItem);
        },
        "Error while updating item.");
  }

  @Test
  public void testDeleteItemSuccess() {
    when(itemRepository.existsById(foundItem.getId())).thenReturn(true);
    when(itemRepository.findById(foundItem.getId()))
        .thenThrow(new LostAndFoundNotFoundException("Item not found."));
    doAnswer(
            (i) -> {
              return null;
            })
        .when(itemRepository)
        .deleteById(foundItem.getId());

    itemService.delete(foundItem.getId());

    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          itemService.getItem(foundItem.getId());
        },
        "Item not found.");
  }

  @Test
  public void testDeleteItemFailure() {
    when(itemRepository.existsById(foundItem.getId())).thenReturn(true);
    doThrow(new LostAndFoundException("Error while deleting item."))
        .when(itemRepository)
        .deleteById(foundItem.getId());

    Assertions.assertThrows(
        LostAndFoundException.class,
        () -> {
          itemService.delete(foundItem.getId());
        },
        "Error while deleting item.");
  }

  @Test
  public void testUpdateReturnSuccess() {
    foundItem.setClaimedBy(lostItem.getCreatedBy());
    foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());

    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));
    when(itemRepository.save(foundItem)).thenReturn(foundItem);

    itemService.updateReturn(foundItem.getId(), lostItem.getCreatedBy());

    Assertions.assertTrue(foundItem.getReturned());
  }

  @Test
  public void testUpdateReturnItemNotFoundException() {
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.empty());

    Assertions.assertThrows(
        LostAndFoundNotFoundException.class,
        () -> {
          itemService.updateReturn(foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item with id does not exists");
  }

  @Test
  public void testUpdateReturnItemAlreadyReturned() {
    foundItem.setClaimedBy(lostItem.getCreatedBy());
    foundItem.setReturned(true);
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          itemService.updateReturn(foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item is already returned.");
  }

  @Test
  public void testUpdateReturnItemNotApproved() {
    foundItem.setClaimedBy("");
    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          itemService.updateReturn(foundItem.getId(), lostItem.getCreatedBy());
        },
        "Item is not yet approved for this user.");
  }

  @Test
  public void testUpdateReturnItemClaimRequestNotAccepted() {
    foundItem.setClaimedBy(lostItem.getCreatedBy());
    foundItem.setReturned(false);
    foundItem.getClaimRequestAccepted().put(lostItem.getId(), foundItem.getCreatedBy());

    when(itemRepository.findById(foundItem.getId())).thenReturn(Optional.of(foundItem));

    Assertions.assertThrows(
        LostAndFoundValidationException.class,
        () -> {
          itemService.updateReturn(foundItem.getId(), lostItem.getCreatedBy());
        },
        "Claim request is not yet accepted for this user.");
  }

  @Test
  public void testGetRequestRaisedItemsByUserIdSuccess() {
    String userId = "losttest@gmail.com";
    boolean isFoundItem = true;

    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
    when(itemRepository.findAllByFoundItem(isFoundItem)).thenReturn(List.of(foundItem, lostItem));

    List<Item> expectedItems = itemService.getRequestRaisedItemsByUserId(userId);

    Item firstItem = expectedItems.get(0);

    Assertions.assertEquals(firstItem.getClaimRequested().get(lostItem.getId()), userId);
  }

  @Test
  public void testGetRequestRaisedItemsByUserIdEmptyList() {
    String userId = "lost@gmail.com";
    boolean isFoundItem = true;

    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
    when(itemRepository.findAllByFoundItem(isFoundItem)).thenReturn(List.of(foundItem, lostItem));

    List<Item> expectedItems = itemService.getRequestRaisedItemsByUserId(userId);

    Assertions.assertEquals(expectedItems.size(), 0);
  }

  @Test
  public void testGetRequestRaisedItemsByUserIdNullClaimRequested() {
    String userId = "losttest@gmail.com";
    boolean isFoundItem = true;
    foundItem.setClaimRequested(null);
    when(itemRepository.findAllByFoundItem(isFoundItem)).thenReturn(List.of(foundItem, lostItem));

    List<Item> expectedItems = itemService.getRequestRaisedItemsByUserId(userId);

    Assertions.assertEquals(expectedItems.size(), 0);
  }
}
