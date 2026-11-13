"use strict";

const path = require("node:path");
const express = require("express");
const { processListing } = require("../backend/backend");

const app = express();

app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "..", "source"), {index: "listing_submission.html"}));

app.post("/api/listings", (req, res) => {
  const result = processListing(req.body);
  return res.status(result.success ? 200 : 400).json(result);
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Listing form: http://localhost:${port}/`);
    console.log(`Listing API: POST http://localhost:${port}/api/listings`);
  });
}

module.exports = app;