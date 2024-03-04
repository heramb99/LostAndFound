package com.lostandfound.LostAndFound.Item.repo;

import com.lostandfound.LostAndFound.Item.entities.Item;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

  /**
   * Method that return the item by its ID
   *
   * @param id
   * @return Optional<Item></Item>
   */
  Optional<Item> findById(String id);

  /**
   * Delete the item by its ID
   *
   * @param id
   */
  void deleteById(String id);

  /***
   *
   * @param id
   * @return true if any item with given id is exists
   */
  boolean existsById(String id);

  /**
   * Get all the items of a user
   *
   * @return list of all items
   */
  List<Item> findAllByFoundItem(boolean foundItem);
}
