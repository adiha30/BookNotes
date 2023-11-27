import axios from "axios";

export async function getCover(book) {
    try {
        const searchUrl = `http://openlibrary.org/search.json?q=${book.title}+${book.author}`;
        const searchResponse = await axios.get(searchUrl);

        if (searchResponse.status === 200) {
          const data = searchResponse.data;

          if (data.docs && data.docs.length > 0) {
            const isbn = data.docs[0].isbn ? data.docs[0].isbn[0] : null;

            if (isbn) {
              const coverUrl = `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
              return coverUrl;
            } else {
              return { error: 'ISBN not found in the search results.'};
            }
          } else {
            return { error: 'No results found for the given title and author.' };
          }
        } else {
          return { error: 'Error in making the request.' }
        }
      } catch (error) {
        console.error(error);
        return { error: 'Internal server error.' }
      }
};