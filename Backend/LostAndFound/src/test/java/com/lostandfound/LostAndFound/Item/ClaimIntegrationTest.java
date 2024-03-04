package com.lostandfound.LostAndFound.Item;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.repo.ItemRepository;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest
public class ClaimIntegrationTest {
  @Value("${auth.token}")
  String bearerToken;

  Date date = new Calendar.Builder().setDate(2023, 11, 2).build().getTime();
  @Autowired private MockMvc mockMvc;
  @Autowired private ItemRepository itemRepository;

  private Item foundItem;
  private Item lostItem;

  @BeforeEach
  void setUp() {
    final double LONGITUDE = 12.123;
    final double LATITUDE = 12.123;

    foundItem = new Item();
    foundItem.setId("abc");
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
    lostItem.setId("def");
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
  public void testUpdateClaimRequestSuccess() throws Exception {
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);

    this.mockMvc
        .perform(
            put("/items/claims/request")
                .header("Authorization", "Bearer " + bearerToken)
                .param("userId", lostItem.getCreatedBy())
                .param("itemId", foundItem.getId())
                .param("lostItemId", lostItem.getId()))
        .andExpect(status().isOk())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.claimRequested.def").value(lostItem.getCreatedBy()));
  }

  @Test
  public void testUpdateClaimRequestAcceptedSuccess() throws Exception {
    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);

    this.mockMvc
        .perform(
            put("/items/claims/accept")
                .header("Authorization", "Bearer " + bearerToken)
                .param("userId", foundItem.getCreatedBy())
                .param("itemId", foundItem.getId())
                .param("claimRequestLostItemId", lostItem.getId()))
        .andExpect(status().isOk())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.claimRequestAccepted.def")
                .value(lostItem.getCreatedBy()));
  }

  @Test
  public void testUpdateClaimRequestAcceptedFailure() throws Exception {
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);

    this.mockMvc
        .perform(
            put("/items/claims/accept")
                .header("Authorization", "Bearer " + bearerToken)
                .param("userId", foundItem.getCreatedBy())
                .param("itemId", foundItem.getId())
                .param("claimRequestLostItemId", lostItem.getId()))
        .andExpect(status().is4xxClientError())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$")
                .value("User has not raised claim request for this item."));
  }

  @Test
  public void testRevokeClaimRequestSuccess() throws Exception {
    foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);

    this.mockMvc
        .perform(
            put("/items/claims/revoke")
                .header("Authorization", "Bearer " + bearerToken)
                .param("userId", lostItem.getCreatedBy())
                .param("itemId", foundItem.getId()))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.claimRequested.def").doesNotExist());
  }

  @Test
  public void testRevokeClaimRequestFailure() throws Exception {
    this.itemRepository.save(foundItem);
    this.itemRepository.save(lostItem);

    this.mockMvc
        .perform(
            put("/items/claims/revoke")
                .header("Authorization", "Bearer " + bearerToken)
                .param("userId", lostItem.getCreatedBy())
                .param("itemId", foundItem.getId()))
        .andExpect(status().is4xxClientError())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$")
                .value("User has not raised claim request for this item."));
  }

    @Test
    public void testApproveClaimSuccess() throws Exception {
        foundItem.getClaimRequestAccepted().put(lostItem.getId(), lostItem.getCreatedBy());
        this.itemRepository.save(foundItem);
        this.itemRepository.save(lostItem);

        this.mockMvc
                .perform(
                        put("/items/claims/approve")
                                .header("Authorization", "Bearer " + bearerToken)
                                .param("userId", foundItem.getCreatedBy())
                                .param("claimUserId", lostItem.getCreatedBy())
                                .param("itemId", foundItem.getId()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.claimRequestAccepted.def").value(lostItem.getCreatedBy()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.claimRequestRejected.def").doesNotExist());
    }

    @Test
    public void testApproveClaimFailure() throws Exception {
        this.itemRepository.save(foundItem);
        this.itemRepository.save(lostItem);

        this.mockMvc
                .perform(
                        put("/items/claims/approve")
                                .header("Authorization", "Bearer " + bearerToken)
                                .param("userId", foundItem.getCreatedBy())
                                .param("claimUserId", lostItem.getCreatedBy())
                                .param("itemId", foundItem.getId()))
                .andExpect(status().is4xxClientError())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("User has not raised claim request for this item."));
    }

    @Test
    public void testRejectClaimSuccess() throws Exception {
        foundItem.getClaimRequested().put(lostItem.getId(), lostItem.getCreatedBy());
        this.itemRepository.save(foundItem);
        this.itemRepository.save(lostItem);

        this.mockMvc
                .perform(
                        put("/items/claims/reject")
                                .header("Authorization", "Bearer " + bearerToken)
                                .param("userId", foundItem.getCreatedBy())
                                .param("claimRequestUserId", lostItem.getCreatedBy())
                                .param("itemId", foundItem.getId()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.claimRejected.def").value(lostItem.getCreatedBy()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.claimRequestAccepted.def").doesNotExist());
    }

    @Test
    public void testRejectClaimFailure() throws Exception {
        foundItem.getClaimRejected().put(lostItem.getId(), lostItem.getCreatedBy());
        this.itemRepository.save(foundItem);
        this.itemRepository.save(lostItem);

        this.mockMvc
                .perform(
                        put("/items/claims/reject")
                                .header("Authorization", "Bearer " + bearerToken)
                                .param("userId", foundItem.getCreatedBy())
                                .param("claimRequestUserId", lostItem.getCreatedBy())
                                .param("itemId", foundItem.getId()))
                .andExpect(status().is4xxClientError())
                .andExpect(MockMvcResultMatchers.jsonPath("$").value("User's claim request has already been rejected for this item."));
    }
}
