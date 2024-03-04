package com.lostandfound.LostAndFound.Item.rest;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.service.IItemService;
import com.lostandfound.LostAndFound.core.utils.SearchFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/items")
public class ItemController {
  @Autowired private IItemService iItemService;

  /**
   * Retrieves an item based on the provided ID.
   *
   * @param id of the item to be retrieved
   * @return an Optional containing the item, or an empty Optional if the item does not exist
   */
  @GetMapping(path = "/{id}")
  public Item get(@PathVariable("id") String id) {

    return this.iItemService.getItem(id);
  }

  /**
   * Retrieve all the items of a user for which the user has raised a claim request.
   *
   * @param userId of the user whose items are to be retrieved
   * @return list of items
   */
  @GetMapping(path = "/request-raised/{userId}")
  public List<Item> getRequestRaisedItemsByUserId(@PathVariable("userId") String userId) {
    return this.iItemService.getRequestRaisedItemsByUserId(userId);
  }

  /**
   * Get filtered items based on different filters
   *
   * @param searchFilter
   * @return filtered items
   */
  @PostMapping("/search")
  public Page<Item> filterItems(@RequestBody SearchFilter searchFilter) {
    return this.iItemService.filterItems(searchFilter);
  }

  /**
   * Updates an existing item.
   *
   * @param item that should be updated
   */
  @PutMapping("/{id}")
  public Item updateItem(@RequestBody Item item) {

    return this.iItemService.update(item);
  }

  /**
   * Creates new item.
   *
   * @param item
   * @return item that inserted.
   */
  @PostMapping
  public Item insertNewItem(@RequestBody Item item) {
    // Create item

    return this.iItemService.create(item);
  }

  /**
   * Deletes an item by its ID.
   *
   * @param id of the item to be deleted
   */
  @DeleteMapping(path = "/{id}")
  public void deleteById(@PathVariable("id") String id) {
    this.iItemService.delete(id);
  }

  /**
   * Set item status returned to true
   *
   * @param id of the item to be updated
   * @param userId of the user whose item is returned
   */
  @PutMapping(path = "/returned/{id}")
  public Item setReturned(@PathVariable("id") String id, @RequestParam("userId") String userId) {
    return this.iItemService.updateReturn(id, userId);
  }
}
