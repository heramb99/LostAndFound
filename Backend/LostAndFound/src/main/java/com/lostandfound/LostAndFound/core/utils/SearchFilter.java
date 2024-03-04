package com.lostandfound.LostAndFound.core.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostandfound.LostAndFound.core.bo.FilterOptions;
import com.lostandfound.LostAndFound.core.bo.LafLocation;
import com.lostandfound.LostAndFound.core.exception.LostAndFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@Getter
@Setter
@NoArgsConstructor
public class SearchFilter {
  private final double EARTH_RADIUS_METERS = 6371000.0;
  private final Integer DAY_END_HOUR = 23;
  private final Integer DAY_END_MIN = 59;
  private final Integer DAY_END_SEC = 59;
  private final Integer DAY_START_HOUR = 0;
  private final Integer DAY_START_MIN = 0;
  private final Integer DAY_START_SEC = 0;

  private final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSX";

  private HashMap<String, FilterOptions> filters = new HashMap<>();
  private int page;
  private int size;
  private String sortField;
  private Sort.Direction sortDirection;

  private Criteria createCriteria(Map.Entry<String, FilterOptions> filter) {
    String key = filter.getKey();
    FilterOptions filterOptions = filter.getValue();
    Object value = filterOptions.getValue();
    String mode = filterOptions.getMode();

    switch (mode) {
      case "on":
        return applyDateOnFilter(key, value);
      case "contains":
        return applyContainsFilter(key, value);
      case "is":
      case "equals":
        return applyEqualsFilter(key, value);
      case "geo":
        return applyGeoFilter("location", value);
      default:
        return handleDefaultFilter();
    }
  }

  public Query buildQuery() {
    Query query = new Query();

    for (Map.Entry<String, FilterOptions> filters : this.filters.entrySet()) {
      query.addCriteria(createCriteria(filters));
    }

    return applySort(query);
  }

  private Query applySort(Query query) {
    if (this.sortField != null) {
      query.with(Sort.by(this.sortDirection, this.sortField));
    }
    return query;
  }

  private Criteria handleDefaultFilter() {
    throw new LostAndFoundException("Invalid filter");
  }

  private Criteria applyContainsFilter(String key, Object value) {
    Criteria criteria = new Criteria(key);
    if (key.equals("keyword")) {
      Criteria titleCriteria = Criteria.where("title").regex(Pattern.quote((String) value), "i");
      Criteria descriptionCriteria =
          Criteria.where("description").regex(Pattern.quote((String) value), "i");
      criteria = new Criteria().orOperator(titleCriteria, descriptionCriteria);
    } else {
      criteria.regex(Pattern.quote((String) value), "i");
    }

    return criteria;
  }

  private Criteria applyGeoFilter(String key, Object value) {
    ObjectMapper objectMapper = new ObjectMapper();
    LafLocation location = objectMapper.convertValue(value, LafLocation.class);
    Point point = new Point(location.getX(), location.getY());
    Double radius = location.getRadius() / EARTH_RADIUS_METERS;
    return new Criteria(key).nearSphere(point).maxDistance(radius);
  }

  private Criteria applyEqualsFilter(String key, Object value) {
    return new Criteria(key).is(value);
  }

  private Criteria applyDateOnFilter(String key, Object value) {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX");
    Criteria criteria = new Criteria(key);
    dateFormat.setLenient(false);
    try {
      Date parsedDate = dateFormat.parse((String) value);

      // Derive the start date
      Calendar calendar = Calendar.getInstance();
      calendar.setTime(parsedDate);
      calendar.set(Calendar.HOUR_OF_DAY, DAY_START_HOUR);
      calendar.set(Calendar.MINUTE, DAY_START_MIN);
      calendar.set(Calendar.SECOND, DAY_START_SEC);
      Date startOfDay = calendar.getTime();

      // Derive the end date
      calendar.setTime(parsedDate);
      calendar.set(Calendar.HOUR_OF_DAY, DAY_END_HOUR);
      calendar.set(Calendar.MINUTE, DAY_END_MIN);
      calendar.set(Calendar.SECOND, DAY_END_SEC);
      Date endOfDay = calendar.getTime();

      return Criteria.where(key).gte(startOfDay).lte(endOfDay);
    } catch (ParseException e) {
      throw new LostAndFoundException(e.getMessage());
    }
  }
}
