package com.lostandfound.LostAndFound.Item;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import com.lostandfound.LostAndFound.core.bo.FilterOptions;
import com.lostandfound.LostAndFound.core.utils.SearchFilter;
import java.util.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest
public class ItemIntegrationTest {
  private final Double LONGITUDE = 12.123;
  private final Double LATITUDE = 12.123;
  private final int PAGE_SIZE = 10;

  @Value("${auth.token}")
  String bearerToken;

  Date date = new Calendar.Builder().setDate(2023, 11, 2).build().getTime();
  @Autowired private MockMvc mockMvc;
  @Autowired private ItemRepository itemRepository;
  @Autowired private ObjectMapper objectMapper;
  private Item foundItem;
  private Item lostItem;

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

  @AfterEach
  public void cleanUp() {
    this.itemRepository.deleteAll();
  }

  @Test
  void testGetItemSuccess() throws Exception {
    // arrange
    this.itemRepository.save(foundItem);

    // act + assert
    mockMvc
        .perform(
            get("/items/" + foundItem.getId()).header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(foundItem.getId()))
        .andExpect(MockMvcResultMatchers.jsonPath("$.title").value(foundItem.getTitle()));
  }

  @Test
  void testGetItemNotFound() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            get("/items/" + foundItem.getId()).header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testGetRequestRaisedItemsByUserId() throws Exception {
    // arrange
    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
    this.itemRepository.save(foundItem);

    // act + assert
    mockMvc
        .perform(
            get("/items/request-raised/" + lostItem.getCreatedBy())
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.[0].id").value(foundItem.getId()));
  }

  @Test
  void testUpdateItemSuccess() throws Exception {
    // arrange
    foundItem.setTitle("new-title");
    this.itemRepository.save(foundItem);

    // act + assert
    mockMvc
        .perform(
            put("/items/" + foundItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(foundItem))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk());
    Optional<Item> item = this.itemRepository.findById(foundItem.getId());
    assertEquals(foundItem.getTitle(), item.get().getTitle());
  }

  @Test
  void testUpdateItemNotFound() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            put("/items/" + foundItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(foundItem))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testDeleteItemSuccess() throws Exception {
    // arrange
    this.itemRepository.save(foundItem);

    // act + assert
    mockMvc
        .perform(
            delete("/items/" + foundItem.getId()).header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk());
    Optional<Item> item = this.itemRepository.findById(foundItem.getId());
    assertTrue(item.isEmpty());
  }

  @Test
  void testDeleteItemNotFound() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            delete("/items/" + foundItem.getId()).header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testInsertItemSuccess() throws Exception {
    // arrange

    // act + assert
    mockMvc
        .perform(
            post("/items/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(foundItem))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk());
    Optional<Item> item = itemRepository.findById(foundItem.getId());
    assertEquals(foundItem.getTitle(), item.get().getTitle());
  }

  @Test
  void testSearchItemSuccess() throws Exception {
    // arrange
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    FilterOptions foundItemFilter = new FilterOptions();
    foundItemFilter.setValue(true);
    foundItemFilter.setMode("is");
    filters.put("foundItem", foundItemFilter);
    searchFilter.setPage(0);
    searchFilter.setSize(PAGE_SIZE);
    searchFilter.setFilters(filters);

    // act + assert
    mockMvc
        .perform(
            post("/items/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchFilter))
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content").isArray())
        .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id").value(foundItem.getId()))
        .andExpect(MockMvcResultMatchers.jsonPath("$.totalElements").value(1));
  }

  @Test
  void testSetReturnedFailure() throws Exception {
    // arrange
    foundItem.setClaimedBy(lostItem.getCreatedBy());
    this.itemRepository.save(foundItem);

    // act + assert
    mockMvc
        .perform(
            put("/items/returned/" + foundItem.getId() + "?userId=" + lostItem.getCreatedBy())
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + bearerToken))
        .andExpect(status().is4xxClientError());
  }
}
