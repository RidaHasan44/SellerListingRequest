"use strict";
 
// MIS 3371 | Week 8 Session 2 — JavaScript object vs JSON TEXT.
// Run: node backend/json-demo.js
// Week 9 will use JSON with HTTP; today nothing is sent over a network.
 
const listing = {
  sellerFirstName: "John",
  sellerLastName: "Doe",
  sellerId: "123456",
  itemName: "Super Cool Hat",
  gender: "male",
  clothingType: "other",
  size: "medium",
  description: "It's a super cool hat",
  price: 500,
  quantity: 1,
  productImages: "true"
};
 
console.log("1. JavaScript object (available inside this program):");
console.log(listing);
 
// stringify converts the object into JSON text. The optional null, 2 arguments
// make it easier to read by adding indentation; they are not required.
const jsonText = JSON.stringify(listing, null, 2);
console.log("\n2. JSON text (a portable representation of the same fields):");
console.log(jsonText);
 
// parse converts JSON text BACK into a usable JavaScript value.
const parsedListing = JSON.parse(jsonText);
console.log("\n3. Parsed back into a JavaScript object:");
console.log(parsedListing);
console.log("\nThis is a LOCAL conversion only. No HTTP, API, Express, or AWS yet.");