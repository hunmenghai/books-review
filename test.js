
import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

test("Open Library returns book details for a valid ISBN", async () => {
  const response = await axios.get(
    "https://openlibrary.org/isbn/9780735211292.json",
    { timeout: 10000 }
  );

  assert.equal(response.status, 200);
  assert.ok(response.data.title);
  console.log(`Found book: ${response.data.title}`);
});
