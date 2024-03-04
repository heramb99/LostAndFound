package com.lostandfound.LostAndFound.Item.rest;

import com.lostandfound.LostAndFound.Item.entities.Item;
import com.lostandfound.LostAndFound.Item.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/items/claims")
public class ClaimController {

  @Autowired private ClaimService claimService;

  /**
   * Updates the list of users who raised a claim request.
   *
   * @param userId of the user who raised a claim request
   * @param itemId of the item that the user raised a claim request for
   * @param lostItemId of the item that the user lost and has linked to the request
   * @return item with updated claim requested list
   */
  @PutMapping("/request")
  public Item updateClaimRequest(
      @RequestParam(required = true) String userId,
      @RequestParam(required = true) String itemId,
      @RequestParam(required = true) String lostItemId) {

    return this.claimService.updateClaimRequest(userId, itemId, lostItemId);
  }

  /**
   * Adds the user who raised a claim request to the list of accepted claim requests.
   *
   * @param userId of the user who is accepting the claim request/founder of the item
   * @param itemId of the item that the user raised a claim request for
   * @param claimRequestLostItemId lost item id of the user whose claim request is to be accepted
   * @return item with updated claim request accepted list
   */
  @PutMapping("/accept")
  public Item updateClaimRequestAccepted(
      @RequestParam(required = true) String userId,
      @RequestParam(required = true) String itemId,
      @RequestParam(required = true) String claimRequestLostItemId) {

    return this.claimService.updateClaimRequestAccepted(userId, itemId, claimRequestLostItemId);
  }

  /**
   * Updates the list of users who raised a claim request by removing the user who revoked the claim
   * request.
   *
   * @param userId of the user who wants to revoke the request
   * @param itemId of the item that the user revoked a claim request for
   * @return item with updated claim requested list
   */
  @PutMapping("/revoke")
  public Item revokeClaimRequest(
      @RequestParam(required = true) String userId, @RequestParam(required = true) String itemId) {
    return this.claimService.revokeClaimRequest(userId, itemId);
  }

  /**
   * Approves the claim request for the item.
   *
   * @param userId of the user who is approving the claim request
   * @param claimUserId of the user whose claim request is to be approved
   * @param itemId of the item for which the claim request is approved
   * @return item with updated claimed by field
   */
  @PutMapping("/approve")
  public Item approveClaim(
      @RequestParam(required = true) String userId,
      @RequestParam(required = true) String itemId,
      @RequestParam(required = true) String claimUserId) {

    return this.claimService.approveClaim(userId, itemId, claimUserId);
  }

  /**
   * Rejects the claim request for the item.
   *
   * @param userId of the user who is rejecting the claim request
   * @param itemId of the item for which the claim request is rejected
   * @param claimRequestUserId user whose claim request is to be rejected
   * @return item with updated claim rejected list
   */
  @PutMapping("/reject")
  public Item rejectClaim(
      @RequestParam(required = true) String userId,
      @RequestParam(required = true) String itemId,
      @RequestParam(required = true) String claimRequestUserId) {

    return this.claimService.rejectClaim(userId, itemId, claimRequestUserId);
  }
}
