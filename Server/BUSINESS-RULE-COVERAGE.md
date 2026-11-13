# Listing Business Rule Test Coverage

The test program sends listing objects to `processListing()` and compares the
actual result with the expected result. It exits with a nonzero status if any
result differs or if there are fewer than two cases in any required test
category.

| Category | Business rule tested | Test case | Expected result | Actual result |
|---|---|---|---|---|
| Valid | Standard listings are accepted | Valid standard listing | Accepted; Standard Approval | Accepted; Standard Approval - PASS |
| Valid | Prices above $500 require manual review | Price $500.01 | Accepted; Manual Review | Accepted; Manual Review - PASS |
| Valid | Restricted categories require manual review | Luxury category | Accepted; Manual Review | Accepted; Manual Review - PASS |
| Invalid | Seller ID must contain six digits | Seller ID has five digits | Rejected; seller ID error | Rejected; seller ID error - PASS |
| Invalid | Seller names allow only letters, spaces, and dashes | First name contains a number | Rejected; name error | Rejected; name error - PASS |
| Invalid | Quantity must be a positive whole number | Quantity is zero | Rejected; quantity error | Rejected; quantity error - PASS |
| Invalid | At least one product photo is required | No product photos | Rejected; photo-count error | Rejected; photo-count error - PASS |
| Invalid | Product photos must have an image MIME type | Photo MIME type is `text/plain` | Rejected; image-type error | Rejected; image-type error - PASS |
| Boundary/edge | Exactly $500 does not require manual review | Price is exactly $500 | Accepted; Standard Approval | Accepted; Standard Approval - PASS |
| Boundary/edge | Ten photos and 1,000 description characters are allowed | Maximum photo and description limits | Accepted; Standard Approval | Accepted; Standard Approval - PASS |
| Boundary/edge | Description cannot exceed 1,000 characters | Description is 1,001 characters | Rejected; description-length error | Rejected; description-length error - PASS |

All eleven test cases passed in the latest test run (3 valid, 5 invalid, and
3 boundary/edge).

The current backend does not implement or test seller verification, payout
eligibility, review within 24 hours, the 100-active-listing cap, configured
shipping carriers, listing status transitions, or restrictions on editing an
active listing. These business rules are not covered by the tests above.