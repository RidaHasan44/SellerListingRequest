"use strict";

/*
 * MIS 3371 | LISTING BACKEND TESTS
 * Run from the repository root: node backend/test-backend.js
 *
 * Each case passes a different listing to the same processListing() function.
 * The tests print expected and actual results and fail if they do not match.
 */

const assert = require("node:assert/strict");
const { processListing } = require("./backend");

// Start each test with a complete, valid listing so each case can focus on
// one changed field instead of repeating the full object.
const standardListing = {
  sellerId: "123456",
  firstName: "Mary-Jane",
  lastName: "Van Buren",
  price: 50,
  quantity: 2,
  category: "clothing",
  condition: "good",
  description: "A gently used blue shirt.",
  images: ["image/jpeg"]
};

// Each case records its assignment category, input listing, and expected result.
const tests = [
  {
    category: "valid",
    name: "Valid standard listing",
    listing: { ...standardListing },
    expected: { success: true, approvalPath: "Standard Approval" }
  },
  {
    category: "valid",
    name: "Valid high-priced listing routes to manual review",
    // A price just above the threshold is still accepted, but needs review.
    listing: { ...standardListing, price: 500.01 },
    expected: { success: true, approvalPath: "Manual Review" }
  },
  {
    category: "valid",
    name: "Restricted-category listing routes to manual review",
    // Restricted categories need review even when the price is low.
    listing: { ...standardListing, category: "luxury" },
    expected: { success: true, approvalPath: "Manual Review" }
  },
  {
    category: "invalid",
    name: "Invalid seller ID is rejected",
    // Five digits are one digit short of the required seller ID.
    listing: { ...standardListing, sellerId: "12345" },
    expected: { success: false, message: "Seller ID must be exactly 6 digits." }
  },
  {
    category: "invalid",
    name: "Seller name containing a number is rejected",
    listing: { ...standardListing, firstName: "Mary3" },
    expected: {
      success: false,
      message: "Seller names may contain letters, spaces, and dashes only."
    }
  },
  {
    category: "invalid",
    name: "Zero quantity is rejected",
    // A listing with no available items cannot be submitted.
    listing: { ...standardListing, quantity: 0 },
    expected: { success: false, message: "Quantity must be a whole number greater than zero." }
  },
  {
    category: "invalid",
    name: "Invalid item condition is rejected",
    listing: { ...standardListing, condition: "used" },
    expected: { success: false, message: "Select a valid item condition." }
  },
  {
    category: "invalid",
    name: "Missing product photos are rejected",
    // Empty image list checks the minimum photo requirement.
    listing: { ...standardListing, images: [] },
    expected: { success: false, message: "A listing must include between 1 and 10 product photos." }
  },
  {
    category: "invalid",
    name: "Non-image product files are rejected",
    listing: { ...standardListing, images: ["text/plain"] },
    expected: { success: false, message: "Product photos must be image files." }
  },
  {
    category: "boundary",
    name: "$500 exactly remains on the standard path",
    // Tests the exact price threshold: the rule says "above" $500.
    listing: { ...standardListing, price: 500 },
    expected: { success: true, approvalPath: "Standard Approval" }
  },
  {
    category: "boundary",
    name: "Ten photos and a 1,000-character description are accepted",
    // Both values are exactly at their allowed maximums.
    listing: {
      ...standardListing,
      description: "a".repeat(1000),
      images: Array(10).fill("image/png")
    },
    expected: { success: true, approvalPath: "Standard Approval" }
  },
  {
    category: "boundary",
    name: "Description over 1,000 characters is rejected",
    // One character over the maximum should be rejected.
    listing: { ...standardListing, description: "a".repeat(1001) },
    expected: { success: false, message: "Description cannot exceed 1,000 characters." }
  }
];

const categoryCounts = { valid: 0, invalid: 0, boundary: 0 };
let failures = 0;
for (const test of tests) {
  // Run backend validation using this test's listing input.
  const actual = processListing(test.listing);
  const expected = test.expected;
  // Compare only the decision fields declared in expected for easier reading.
  const actualSummary = {
    success: actual.success,
    ...(actual.success
      ? { approvalPath: actual.approvalPath }
      : { message: actual.message })
  };

  categoryCounts[test.category] += 1;
  console.log(`\n--- ${test.category.toUpperCase()}: ${test.name} ---`);
  console.log("Expected:", expected);
  console.log("Actual:  ", actualSummary);

  try {
    // A mismatch throws an assertion error that is reported below.
    assert.deepEqual(actualSummary, expected);
    console.log("PASS");
  } catch (error) {
    failures += 1;
    console.error("FAIL:", error.message);
  }
}

// Enforce the assignment's minimum of two cases in each required category.
// This prevents a future edit from accidentally removing the required coverage.
for (const category of Object.keys(categoryCounts)) {
  if (categoryCounts[category] < 2) {
    failures += 1;
    console.error(`FAIL: Need at least two ${category} cases; found ${categoryCounts[category]}.`);
  }
}

// Print both the pass count and coverage split for the assignment checklist.
console.log(
  `\n${tests.length - failures}/${tests.length} test cases passed ` +
  `(${categoryCounts.valid} valid, ${categoryCounts.invalid} invalid, ` +
  `${categoryCounts.boundary} boundary/edge).`
);
// A nonzero process exit status marks the test run as failed in the terminal.
if (failures > 0) process.exitCode = 1;
