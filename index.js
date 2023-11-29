import express from "express";
import { getAllBooks, getNotes, publishBookReview, getBook } from "./db/utils.js";
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


app.listen(port, () => {
    console.log(`App listens on port ${port}`);
});