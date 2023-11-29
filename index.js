import express from "express";
import { getAllBooks, getNotes, publishBookReview, getBook, publishNote } from "./db/utils.js";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getCover } from "./indexUtils.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get('/', async (req, res) => {
    const books = await getAllBooks();

    console.log(books);
    res.render('index.ejs', { books });
});

app.get('/book/:id', async (req, res) => {
    const book_id = req.params.id;
    const book = await getBook(book_id)
    var notes = await getNotes(book_id);

    notes = notes.sort(function(a,b) { return new Date(a.date) - new Date(b.date)});

    res.render('book.ejs', { book, notes });
});

app.get('/new', (req, res) => {
    res.render('newBook.ejs');
});

app.post('/new', async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary
    };

    book.cover = await getCover(book);
    await publishBookReview(book);

    res.redirect('/');
});

app.post('/add-note', async (req,res) => {
    const book_id = req.body.book_id;
    const content = req.body.content;
    const noteToPublish = {
        date: new Date(),
        note: content,
        book_id: book_id
    };

    await publishNote(noteToPublish);

    res.redirect(`/book/${book_id}`);
});

app.delete('/delete-note/:id', async (req, res) => {
    console.log(req);
});

app.listen(port, () => {
    console.log(`App listens on port ${port}`);
});