# Listing backend example

This Week 8 classroom backend validates marketplace listings locally. It does
not start an HTTP server, save data, or connect to the browser form.

The example implements three business-rule groups:

1. Seller ID must be six digits; seller names may contain letters, spaces,
   and dashes.
2. Listings require a positive whole-number quantity, a non-empty description
   of at most 1,000 characters, and 1–10 image files.
3. Listings priced above $500 or in the `designer` / `luxury` categories route
   to manual review; other valid listings use standard approval.

Run the expected-versus-actual test cases from the repository root:

```sh
node backend/test-backend.js
```

The test set includes at least two valid, two invalid, and two boundary/edge
cases. See [TEST-RESULTS.md](./TEST-RESULTS.md) for the case list and expected
outcomes.
