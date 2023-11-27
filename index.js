import express from "express";
import { getAllBooks, getNotes, publishBookReview, publishNote } from "./db/utils.js";
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

    res.render('index.ejs', { books });
});

app.get('/book/:id', async (req, res) => {
    const notes = await getNotes(req.query.id);

    res.render('book.ejs', { notes });
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

    res.redirect('/');
});


app.listen(port, () => {
    console.log(`App listens on port ${port}`);
});