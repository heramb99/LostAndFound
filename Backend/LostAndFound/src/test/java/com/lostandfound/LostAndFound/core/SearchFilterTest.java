package com.lostandfound.LostAndFound.core;

import static org.junit.jupiter.api.Assertions.*;

import com.lostandfound.LostAndFound.core.bo.FilterOptions;
import com.lostandfound.LostAndFound.core.bo.LafLocation;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import com.lostandfound.LostAndFound.core.utils.SearchFilter;
import java.util.HashMap;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Query;

public class SearchFilterTest {

  private final Double RADIUS = 100.0;

  private final int PAGE = 5;
  @Test
  void testBuildQueryWithDateFilterSuccess() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("date", new FilterOptions("2023-01-01T12:34:56.789Z", "on"));
    searchFilter.setFilters(filters);

    // act
    Query query = searchFilter.buildQuery();

    // assert
    assertTrue(query.toString().contains("date"));
  }

  @Test
  void testBuildQueryWithDateFilterThrowsException() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("date", new FilterOptions("2023-01-01", "on"));
    searchFilter.setFilters(filters);

    // act + assert
    Assertions.assertThrows(
        LostAndFoundException.class,
        () -> {
          searchFilter.buildQuery();
        });
  }

  @Test
  void testBuildQueryWithKeywordContainsFilter() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("keyword", new FilterOptions("keywordToContain", "contains"));
    searchFilter.setFilters(filters);

    // act
    Query query = searchFilter.buildQuery();

    // assert
    assertTrue(query.toString().contains("title") && query.toString().contains("description"));
  }

  @Test
  void testBuildQueryWithContainsFilter() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("createdBy", new FilterOptions("keywordToContain", "contains"));
    searchFilter.setFilters(filters);

    // act
    Query query = searchFilter.buildQuery();

    // assert
    assertFalse(query.toString().contains("title"));
  }

  @Test
  void testBuildQueryWithGeoFilter() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    LafLocation location = new LafLocation(0.0, 0.0, RADIUS);
    filters.put("location", new FilterOptions(location, "geo"));
    searchFilter.setFilters(filters);

    // act
    Query query = searchFilter.buildQuery();

    // assert
    assertTrue(query.toString().contains("location"));
  }

  @Test
  void testBuildQueryWithInvalidFilter() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("invalid-filter-key", new FilterOptions("invalid-filter-value", "invalid"));
    searchFilter.setFilters(filters);

    // act + assert
    Assertions.assertThrows(
        LostAndFoundException.class,
        () -> {
          searchFilter.buildQuery();
        });
  }

  @Test
  void testBuildQueryWithEqualFilter() {
    // arrange
    SearchFilter searchFilter = new SearchFilter();
    HashMap<String, FilterOptions> filters = new HashMap<>();
    filters.put("postedBy", new FilterOptions("harshshah@gmail.com", "equals"));
    searchFilter.setFilters(filters);
    searchFilter.setPage(PAGE);
    searchFilter.setSortField("postedAt");
    searchFilter.setSortDirection(Sort.Direction.ASC);
    // act
    Query query = searchFilter.buildQuery();
    System.out.println(query.toString());

    // assert
    assertEquals(
        "Query: { \"postedBy\" : \"harshshah@gmail.com\"}, Fields: {}, Sort: { \"postedAt\" : 1}",
        query.toString());
  }
}
