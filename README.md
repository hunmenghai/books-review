# 📚 Books Review

A personal reading journal where I keep track of books I've read, my ratings, and the thoughts and notes I want to remember.

## Features

- Add books using their ISBN
- Retrieve book information from the Open Library API
- Record ratings and personal reading notes
- Edit reviews and ratings
- Delete books
- Sort books by rating, completion date, or title
- View book covers and publication details
- Store book information in PostgreSQL

## Built With

- Node.js
- Express
- EJS
- PostgreSQL
- Axios
- Open Library API
- HTML and CSS

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/hunmenghai/books-review.git
cd books-review
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the database settings required by `index.js`:

```env
PORT=3000
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

Replace the example values with your own PostgreSQL configuration. Never commit your real `.env` file.

### 3. Create the database

Create a PostgreSQL database and a `books` table with columns matching the queries in `index.js` before starting the app.

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(20),
    publication_year INTEGER,
    rating INTEGER,
    note TEXT,
    finished_at DATE
);

### 4. Start the application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Author

Hun Menghai · [GitHub](https://github.com/hunmenghai)