import express from "express";
import { getAllBooks } from "./db/utils.js";
import { getNotes } from "./db/utils.js";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
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


app.listen(port, () => {
    console.log(`App listens on port ${port}`);
});