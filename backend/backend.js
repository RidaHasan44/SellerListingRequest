"use strict";

/*
 * MIS 3371 | LISTING BACKEND LOGIC
 *
 * A submitted listing is validated and routed through this one function.
 * This is a local classroom example: it does not start a server or save data.
 */

const MODERATOR_REVIEW_PRICE = 500;
// Category names are normalized to lowercase before checking this set.
const RESTRICTED_CATEGORIES = new Set(["designer", "luxury"]);
const VALID_CONDITIONS = new Set([
  "newWithTags",
  "newWithoutTags",
  "veryGood",
  "good",
  "satisfactory"
]);

// Return the same simple failure shape whenever validation rejects a listing.
function fail(message) {
  return {
    success: false,
    message
  };
}

/**
 * Validate a seller listing and return its approval route.
 * @param {object} listing - Seller and product information.
 * @returns {object} Validation result and approval route, if accepted.
 */
function processListing(listing) {
  // Reject missing or non-object input before trying to read listing fields.
  if (!listing || typeof listing !== "object" || Array.isArray(listing)) {
    return fail("Listing information is required.");
  }

  // Rule 1: seller ID and names must follow the seller information rules.
  // Convert and trim values so surrounding whitespace does not invalidate them.
  const sellerId = String(listing.sellerId ?? "").trim();
  const firstName = String(listing.firstName ?? "").trim();
  const lastName = String(listing.lastName ?? "").trim();
  // Unicode letter matching supports names with letters beyond A through Z.
  const validName = /^\p{L}+(?:[ -]\p{L}+)*$/u;

  // The ID must contain six numeric characters, including any leading zeroes.
  if (!/^\d{6}$/.test(sellerId)) {
    return fail("Seller ID must be exactly 6 digits.");
  }

  if (!validName.test(firstName) || !validName.test(lastName)) {
    return fail("Seller names may contain letters, spaces, and dashes only.");
  }

  // Rule 2: listing details must satisfy quantity, description, photo, and condition rules.
  const condition = String(listing.condition ?? "").trim();
  if (!VALID_CONDITIONS.has(condition)) {
    return fail("Select a valid item condition.");
  }

  // Number.isInteger disallows fractional quantities as well as zero/negative values.
  const quantity = Number(listing.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return fail("Quantity must be a whole number greater than zero.");
  }

  // Require text before applying the maximum description length.
  if (typeof listing.description !== "string" || listing.description.trim() === "") {
    return fail("A listing description is required.");
  }

  if (listing.description.length > 1000) {
    return fail("Description cannot exceed 1,000 characters.");
  }

  // Photos must be supplied as an array containing 1 through 10 entries.
  if (!Array.isArray(listing.images) || listing.images.length < 1 || listing.images.length > 10) {
    return fail("A listing must include between 1 and 10 product photos.");
  }

  // Each photo entry represents a MIME type such as "image/jpeg".
  if (listing.images.some((image) => typeof image !== "string" || !image.startsWith("image/"))) {
    return fail("Product photos must be image files.");
  }

  // Convert the submitted price to a number and reject invalid or non-positive values.
  const price = Number(listing.price);
  if (!Number.isFinite(price) || price <= 0) {
    return fail("Price must be greater than zero.");
  }

  // Rule 3: high-priced or restricted-category listings need manual review.
  // Normalize category capitalization and whitespace before checking the restricted set.
  const category = String(listing.category ?? "").trim().toLowerCase();
  // Exactly $500 uses standard approval; only a greater price requires review.
  const manualReviewRequired =
    price > MODERATOR_REVIEW_PRICE || RESTRICTED_CATEGORIES.has(category);

  // Successful validation returns the decision, not a saved or published listing.
  return {
    success: true,
    approvalPath: manualReviewRequired ? "Manual Review" : "Standard Approval",
    manualReviewRequired,
    condition,
    message: manualReviewRequired
      ? "Listing passed validation and requires manual review."
      : "Listing passed validation and is eligible for standard approval."
  };
}

// Export the processing function and rule constants for the test file to import.
module.exports = {
  processListing,
  MODERATOR_REVIEW_PRICE,
  RESTRICTED_CATEGORIES,
  VALID_CONDITIONS
};
