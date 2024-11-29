const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Base API URL for the backend server
const API_URL = 'https://book-collection-server-tau.vercel.app';

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Render home page
});

app.get('/books', async (req, res) => {
  try {
    const booksResponse = await axios.get(`${API_URL}/books`);
    const genresResponse = await axios.get(`${API_URL}/genres`);
    res.render('books', {
      books: booksResponse.data,
      genres: genresResponse.data,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/add-book', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/genres`);
    const genres = response.data;
    res.render('addBook', { genres }); 
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).send('Error loading the Add Book page.');
  }
});

app.post('/books', async (req, res) => {
  const { title, author, price, genre_id, copies_left, image_url } = req.body;
  try {
    // Forward the request to the backend API
    await axios.post(`${API_URL}/books`, {
      title,
      author,
      price,
      genre_id,
      copies_left,
      image_url,
    },{
      timeout: 5000,
    });
    res.redirect('/books'); // Redirect to books list after successful addition
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Error adding the book.');
  }
});



app.get('/genres', async (req, res) => {
  try {
    const genresResponse = await axios.get(`${API_URL}/genres`);
    res.render('genres', { genres: genresResponse.data });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // Start the server
app.listen(PORT, () => {
  console.log(`Client running at http://localhost:${PORT}`);
});

// module.exports = app;