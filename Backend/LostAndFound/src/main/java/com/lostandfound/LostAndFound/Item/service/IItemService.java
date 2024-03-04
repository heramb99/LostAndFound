package com.lostandfound.LostAndFound.Item.service;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.core.utils.SearchFilter;
import java.util.List;
import org.springframework.data.domain.Page;

public interface IItemService {

  /**
   * Creates a new item.
   *
   * @param item which needs to be created
   */
  Item create(Item item);

  /**
   * Retrieves an item based on the provided ID.
   *
   * @param id of the item to be retrieved
   * @return an Optional containing the item, or an empty Optional if the item does not exist
   */
  Item getItem(String id);

  /**
   * Updates an existing item.
   *
   * @param item needs to be updated
   * @return updated item
   */
  Item update(Item item);

  /**
   * This method will use to delete the item using its id.
   *
   * @param id of the item that needs to be deleted
   */
  void delete(String id);

  /**
   * This method will filter the items with pagination
   *
   * @param searchFilter
   * @return filtered items
   */
  Page<Item> filterItems(SearchFilter searchFilter);

  /**
   * This method will update the returned status of the item
   *
   * @param itemId of the item which is returned
   * @param userId of the user whose item is returned
   * @return updated item
   */
  Item updateReturn(String itemId, String userId);

  /**
   * Retrieve all the items of a user for which the user has raised a claim request.
   *
   * @param userId of the user whose items are to be retrieved
   * @return list of items
   */
  List<Item> getRequestRaisedItemsByUserId(String userId);
}
