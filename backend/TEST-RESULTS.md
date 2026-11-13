# Listing backend test results

The test program prints an expected result and an actual result for each case,
then checks that they match. It also exits with a nonzero status if any result
differs or if there are fewer than two cases in any required test category.

| Category | Case | Expected result | Actual result |
|---|---|---|---|
| Valid | Standard listing | Accepted; Standard Approval | Accepted; Standard Approval — PASS |
| Valid | Price $500.01 | Accepted; Manual Review | Accepted; Manual Review — PASS |
| Valid | Luxury category | Accepted; Manual Review | Accepted; Manual Review — PASS |
| Invalid | Seller ID has five digits | Rejected; seller ID error | Rejected; seller ID error — PASS |
| Invalid | Quantity is zero | Rejected; quantity error | Rejected; quantity error — PASS |
| Invalid | No product photos | Rejected; photo-count error | Rejected; photo-count error — PASS |
| Boundary/edge | Price is exactly $500 | Accepted; Standard Approval | Accepted; Standard Approval — PASS |
| Boundary/edge | Ten photos and 1,000-character description | Accepted; Standard Approval | Accepted; Standard Approval — PASS |
| Boundary/edge | Description is 1,001 characters | Rejected; description-length error | Rejected; description-length error — PASS |

All nine tests passed.

--- VALID: Valid standard listing ---
Expected: { success: true, approvalPath: 'Standard Approval' }
Actual:   { success: true, approvalPath: 'Standard Approval' }
PASS

--- VALID: Valid high-priced listing routes to manual review ---
Expected: { success: true, approvalPath: 'Manual Review' }
Actual:   { success: true, approvalPath: 'Manual Review' }
PASS

--- VALID: Restricted-category listing routes to manual review ---
Expected: { success: true, approvalPath: 'Manual Review' }
Actual:   { success: true, approvalPath: 'Manual Review' }
PASS

--- INVALID: Invalid seller ID is rejected ---
Expected: { success: false, message: 'Seller ID must be exactly 6 digits.' }
Actual:   { success: false, message: 'Seller ID must be exactly 6 digits.' }
PASS

--- INVALID: Zero quantity is rejected ---
Expected: {
  success: false,
  message: 'Quantity must be a whole number greater than zero.'
}
Actual:   {
  success: false,
  message: 'Quantity must be a whole number greater than zero.'
}
PASS

--- INVALID: Missing product photos are rejected ---
Expected: {
  success: false,
  message: 'A listing must include between 1 and 10 product photos.'
}
Actual:   {
  success: false,
  message: 'A listing must include between 1 and 10 product photos.'
}
PASS

--- BOUNDARY: $500 exactly remains on the standard path ---
Expected: { success: true, approvalPath: 'Standard Approval' }
Actual:   { success: true, approvalPath: 'Standard Approval' }
PASS

--- BOUNDARY: Ten photos and a 1,000-character description are accepted ---
Expected: { success: true, approvalPath: 'Standard Approval' }
Actual:   { success: true, approvalPath: 'Standard Approval' }
PASS

--- BOUNDARY: Description over 1,000 characters is rejected ---
Expected: {
  success: false,
  message: 'Description cannot exceed 1,000 characters.'
}
Actual:   {
  success: false,
  message: 'Description cannot exceed 1,000 characters.'
}
PASS

9/9 test cases passed (3 valid, 3 invalid, 3 boundary/edge).