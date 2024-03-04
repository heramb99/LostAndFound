package com.lostandfound.LostAndFound.Item.service.impl;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import com.lostandfound.LostAndFound.Item.service.IItemService;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundNotFoundException;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundValidationException;
import com.lostandfound.LostAndFound.core.utils.SearchFilter;
import com.lostandfound.LostAndFound.reward.service.RewardService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class ItemSeviceImpl implements IItemService {

  @Autowired private ItemRepository itemRepository;

  @Autowired private MongoTemplate mongoTemplate;
  @Autowired private RewardService rewardService;

  @Override
  public Item create(Item item) {
    try {
      return this.itemRepository.save(item);
    } catch (Exception e) {
      throw new LostAndFoundException("Error while posting new item.");
    }
  }

  @Override
  public Item getItem(String id) {
    Optional<Item> item = this.itemRepository.findById(id);
    if (!item.isPresent()) {
      throw new LostAndFoundNotFoundException("Item not found.");
    }

    return item.get();
  }

  @Override
  public Item update(Item item) {
    if (!this.itemRepository.existsById(item.getId())) {
      throw new LostAndFoundNotFoundException("Item with id does not exists");
    }

    try {
      return this.itemRepository.save(item);
    } catch (Exception e) {
      throw new LostAndFoundException("Error while updating item.");
    }
  }

  @Override
  public void delete(String id) {
    if (!this.itemRepository.existsById(id)) {
      throw new LostAndFoundNotFoundException("Item with id does not exists");
    }
    try {
      this.itemRepository.deleteById(id);
    } catch (Exception e) {
      throw new LostAndFoundException("Error while deleting item.");
    }
  }

  @Override
  public Page<Item> filterItems(SearchFilter searchFilter) {
    try {
      Pageable pageable = PageRequest.of(searchFilter.getPage(), searchFilter.getSize());
      Query query = searchFilter.buildQuery();
      Long count = this.mongoTemplate.count(query, Item.class);
      List<Item> items = this.mongoTemplate.find(query.with(pageable), Item.class);
      return new PageImpl<>(items, pageable, count);
    } catch (Exception e) {
      throw new LostAndFoundException("Something went wrong.");
    }
  }

  Item fetchItemById(String itemId) {
    Optional<Item> itemOptional = this.itemRepository.findById(itemId);

    if (itemOptional.isEmpty()) {
      throw new LostAndFoundNotFoundException("Item with id does not exists");
    }

    return itemOptional.get();
  }

  /**
   * This method will update the returned status of the item and give reward to the user who found
   * it.
   *
   * @param itemId of the item which is returned
   * @param userId of the user whose item is returned
   * @return item with updated returned status
   */
  @Override
  public Item updateReturn(String itemId, String userId) {
    Item storedItem = fetchItemById(itemId);

    if (storedItem.getReturned()) {
      throw new LostAndFoundValidationException("Item is already returned.");
    }

    if (!storedItem.getClaimedBy().equals(userId)) {
      throw new LostAndFoundValidationException("Item is not yet approved for this user.");
    }

    String lostItemId = getLostItemId(storedItem.getClaimRequestAccepted().entrySet().stream(), userId);

    if (lostItemId == null) {
      throw new LostAndFoundValidationException("Claim request is not yet accepted for this user.");
    }

    storedItem.setReturned(true);
    this.rewardService.giveReward(userId, lostItemId, storedItem);

    return this.itemRepository.save(storedItem);
  }

  private String getLostItemId(Stream<Map.Entry<String, String>> stream, String userId) {
    Optional<String> itemId = stream.filter(entry -> entry.getValue().equals(userId))
            .map(Map.Entry::getKey)
            .findFirst();

    if(itemId.isEmpty()) {
      return null;
    }

    return itemId.get();
  }

  /**
   * Retrieve all the items of a user for which the user has raised a claim request.
   *
   * @param userId of the user whose items are to be retrieved
   * @return list of items
   */
  @Override
  public List<Item> getRequestRaisedItemsByUserId(String userId) {

    return this.itemRepository.findAllByFoundItem(true).stream()
        .filter(
            item -> {
              if (item.getClaimRequested() != null) {
                return item.getClaimRequested().containsValue(userId);
              }
              return false;
            })
        .toList();
  }
}
