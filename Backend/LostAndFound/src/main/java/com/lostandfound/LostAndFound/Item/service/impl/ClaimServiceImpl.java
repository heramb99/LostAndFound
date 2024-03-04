package com.lostandfound.LostAndFound.Item.service.impl;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import com.lostandfound.LostAndFound.Item.service.ClaimService;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundValidationException;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClaimServiceImpl implements ClaimService {
  @Autowired private ItemRepository itemRepository;

  @Override
  public Item updateClaimRequest(String userId, String itemId, String lostItemId) {

    Item storedItem = fetchItem(itemId);
    Item lostItem = fetchItem(lostItemId);

    if (storedItem.getClaimedBy() != null) {
      throw new LostAndFoundValidationException("Item is already claimed by someone.");
    }

    if (storedItem.getCreatedBy().equals(userId)) {
      throw new LostAndFoundValidationException(
          "You can not raise claim request for item posted by you.");
    }

    if (!lostItem.getCreatedBy().equals(userId)) {
      throw new LostAndFoundValidationException(
          "You can not raise claim request for item that you have not lost.");
    }

    Map<String, String> claimRequestAccepted = storedItem.getClaimRequestAccepted();

    if (claimRequestAccepted != null && claimRequestAccepted.containsValue(userId)) {
      throw new LostAndFoundValidationException(
          "Your claim request has already been accepted for this item.");
    }

    Map<String, String> claimRejected = storedItem.getClaimRejected();
    if (claimRejected != null && claimRejected.containsValue(userId)) {
      throw new LostAndFoundValidationException(
          "Your claim request has already been rejected for this item.");
    }

    Map<String, String> claimRequested = storedItem.getClaimRequested();

    if (claimRequested.containsValue(userId)) {
      throw new LostAndFoundValidationException(
          "You have already raised claim request for this item.");
    }
    claimRequested.put(lostItemId, userId);
    return this.itemRepository.save(storedItem);
  }

  private Item fetchItem(String itemId) {
    Optional<Item> item = this.itemRepository.findById(itemId);
    if (item.isEmpty()) {
      throw new LostAndFoundNotFoundException("Item with id does not exists");
    }

    return item.get();
  }

  @Override
  public Item updateClaimRequestAccepted(
      String userId, String itemId, String claimRequestLostItemId) {

    Item storedItem = fetchItem(itemId);

    Map<String, String> claimRequested = storedItem.getClaimRequested();
    String claimRequestUserId = claimRequested.get(claimRequestLostItemId);

    if (storedItem.getClaimedBy() != null) {
      throw new LostAndFoundValidationException("Item is already claimed by someone.");
    }

    if (!storedItem.getCreatedBy().equals(userId)) {
      throw new LostAndFoundValidationException(
          "You can not accept claim request for item posted by other user.");
    }

    if (storedItem.getCreatedBy().equals(claimRequestUserId)) {
      throw new LostAndFoundValidationException(
          "You can not accept claim request for item posted by you.");
    }

    Map<String, String> claimRequestAccepted = storedItem.getClaimRequestAccepted();

    if (claimRequestAccepted.containsKey(claimRequestLostItemId)) {
      throw new LostAndFoundValidationException(
          "You have already accepted claim request for this user.");
    }

    if (!claimRequested.containsValue(claimRequestUserId)) {
      throw new LostAndFoundValidationException("User has not raised claim request for this item.");
    }

    claimRequestAccepted.put(claimRequestLostItemId, claimRequestUserId);
    claimRequested.remove(claimRequestLostItemId);

    return this.itemRepository.save(storedItem);
  }

  @Override
  public Item revokeClaimRequest(String userId, String itemId) {
    Item storedItem = fetchItem(itemId);

    Map<String, String> claimRequested = storedItem.getClaimRequested();
    if (claimRequested == null || !claimRequested.containsValue(userId)) {
      throw new LostAndFoundValidationException("User has not raised claim request for this item.");
    }

    String lostItemId = null;
    for (Map.Entry<String, String> entry : claimRequested.entrySet()) {
      if (entry.getValue().equals(userId)) {
        lostItemId = entry.getKey();
        break;
      }
    }

    claimRequested.remove(lostItemId);
    return this.itemRepository.save(storedItem);
  }

  @Override
  public Item approveClaim(String userId, String itemId, String claimRequestUserId) {
    Item storedItem = fetchItem(itemId);

    if (storedItem.getClaimedBy() != null) {
      throw new LostAndFoundValidationException("Item is already claimed by someone.");
    }

    if (!storedItem.getCreatedBy().equals(userId)) {
      throw new LostAndFoundValidationException(
          "You can not approve claim request for item posted by other user.");
    }

    if (storedItem.getCreatedBy().equals(claimRequestUserId)) {
      throw new LostAndFoundValidationException(
          "You yourself cannot be the item founder and claimant.");
    }

    Map<String, String> claimRequestAccepted = storedItem.getClaimRequestAccepted();

    if (claimRequestAccepted == null || !claimRequestAccepted.containsValue(claimRequestUserId)) {
      throw new LostAndFoundValidationException("User has not raised claim request for this item.");
    }

    storedItem.setClaimedBy(claimRequestUserId);
    return this.itemRepository.save(storedItem);
  }

  @Override
  public Item rejectClaim(String userId, String itemId, String claimRequestUserId) {
    Item storedItem = fetchItem(itemId);
    Map<String, String> claimRejected = storedItem.getClaimRejected();

    if (claimRejected == null || claimRejected.containsValue(claimRequestUserId)) {
      throw new LostAndFoundValidationException(
          "User's claim request has already been rejected for this item.");
    }

    Map<String, String> claimRequested = storedItem.getClaimRequested();

    String lostItemId = null;
    for (Map.Entry<String, String> entry : claimRequested.entrySet()) {
      if (entry.getValue().equals(claimRequestUserId)) {
        lostItemId = entry.getKey();
        break;
      }
    }

    claimRejected.put(lostItemId, claimRequestUserId);
    claimRequested.remove(lostItemId);
    return this.itemRepository.save(storedItem);
  }
}
