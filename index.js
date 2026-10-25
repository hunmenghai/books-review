import "dotenv/config";
import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const sort = req.query.sort;

  let query;

  if (sort === "rating") {
    query = "SELECT * FROM books ORDER BY rating DESC";
  } else if (sort === "recent") {
    query = "SELECT * FROM books ORDER BY finished_at DESC";
  } else if (sort === "title") {
    query = "SELECT * FROM books ORDER BY title ASC";
  } else {
    query = "SELECT * FROM books ORDER BY id ASC";
  }

  try {
    const result = await db.query(query);


    res.render("index.ejs", {
      books: result.rows,
      sort: sort || "default",
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Could not load books.");
  }
});

async function getBookData(isbn, fallbackTitle, fallbackYear) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/isbn/${isbn}.json`,
      { timeout: 10000 }
    );

    return {
      title: response.data.title || fallbackTitle,
      year: response.data.publish_date || fallbackYear,
    };
  } catch (error) {
    console.log("API failed:", error.code);

    return {
      title: fallbackTitle,
      year: fallbackYear,
    };
  }
}

app.post("/add-book", async (req, res) => {
  const {
    isbn,
    title,
    author,
    publication_year,
    rating,
    note,
    finished_at,
  } = req.body;

  const cleanIsbn = isbn.replace(/[-\s]/g, "");

  try {
    const bookData = await getBookData(
      cleanIsbn,
      title,
      publication_year
    );

    await db.query(
      `INSERT INTO books
      (title, author, isbn, publication_year, rating, note, finished_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        bookData.title,
        author,
        cleanIsbn,
        bookData.year || null,
        rating,
        note,
        finished_at || null,
      ]
    );

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Could not add book.");
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.id;
  const note = req.body.note;
  const rating = req.body.rating;

  try {
    await db.query(
      "UPDATE books SET note = $1, rating = $2 WHERE id = $3",
      [note, rating, id]
    );

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Could not update book.");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;

  try {
    await db.query(
      "DELETE FROM books WHERE id = $1",
      [id]
    );

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Could not delete book.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});