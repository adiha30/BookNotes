import pg from "pg";

const db = new pg.Client({
    host: "localhost",
    port: 5432,
    database: "BookNotes",
    user: "postgres",
    password: "Aa123456"
});
db.connect();

const BOOK_TABLE = "books";
const NOTES_TABLE = "book_notes";

export async function getAllBooks() {
    let books = [];

    const result = await db.query(`SELECT * FROM ${BOOK_TABLE}`);
    result.rows.forEach((book) => books.push(book));

    return books;
}

export async function publishBookReview(book) {
    await db.query(`INSERT INTO ${BOOK_TABLE} (title, author, cover, summary) VALUES ($1, $2, $3 ,$4)`,
    [book.title, book.author, book.cover, book.summary]);
}

export async function getNotes(book_id) {
    let notes = [];

    const result = await db.query(`SELECT * FROM ${NOTES_TABLE} WHERE book_id = $1`, [book_id]);
    result.rows.forEach((note) => notes.push({
        date: note.date,
        note: note.note
    }));

    return notes;
}
export async function publishNote(note) {
    console.log(note.book_id);
    await db.query(`INSERT INTO ${NOTES_TABLE} (date, note, book_id) VALUES ($1, $2, $3)`,
    [note.date, note.note, note.book_id]);
}

