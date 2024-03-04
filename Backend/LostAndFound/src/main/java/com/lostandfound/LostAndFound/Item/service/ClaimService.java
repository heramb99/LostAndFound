package com.lostandfound.LostAndFound.Item.service;

import com.lostandfound.LostAndFound.Item.entities.Item;

public interface ClaimService {
  /**
   * Updates the claim request for the item.
   *
   * @param userId of the user who raised the claim request
   * @param itemId of the item for which the claim request is raised
   * @param lostItemId of the item that the user lost and has linked to the request
   * @return item with updated claim requested list
   */
  Item updateClaimRequest(String userId, String itemId, String lostItemId);

  /**
   * Updates the claim request accepted list for the item.
   *
   * @param userId of the user whose claim request is to be accepted
   * @param itemId of the item for which the claim request is to be accepted
   * @param claimRequestLostItemId lost item id of the user whose claim request is to be accepted
   */
  Item updateClaimRequestAccepted(String userId, String itemId, String claimRequestLostItemId);

  /**
   * Updates the claim request accepted list for the item.
   *
   * @param userId of the user who revoked the claim request
   * @param itemId of the item for which the claim request is revoked
   */
  Item revokeClaimRequest(String userId, String itemId);

  /**
   * Approves the claim request for the item.
   *
   * @param userId of the user who is approving the claim request
   * @param itemId of the item for which the claim request is approved
   * @param claimRequestUserId user whose claim request is to be approved
   * @return item with updated claimed by field
   */
  Item approveClaim(String userId, String itemId, String claimRequestUserId);

  /**
   * Rejects the claim request for the item.
   *
   * @param userId of the user who is rejecting the claim request
   * @param itemId of the item for which the claim request is rejected
   * @param claimRequestUserId user whose claim request is to be rejected
   * @return item with updated claim rejected list
   */
  Item rejectClaim(String userId, String itemId, String claimRequestUserId);
}
