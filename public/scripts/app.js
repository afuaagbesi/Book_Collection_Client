axios.defaults.baseURL = 'https://book-collection-server-tau.vercel.app';


function openAddBookModal() {
    const modalHTML = `
      <div class="modal" id="addBookModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Book</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addBookForm">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input type="text" id="title" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="author" class="form-label">Author</label>
                  <input type="text" id="author" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" id="price" class="form-control" step="0.01" required>
                </div>
                <div class="mb-3">
                  <label for="genre" class="form-label">Genre</label>
                  <select id="genre" class="form-select" required>
                    <option value="">Select Genre</option>
                    ${genres.map(genre => `<option value="${genre.id}">${genre.name}</option>`).join('')}
                  </select>
                </div>
                <div class="mb-3">
                  <label for="copies" class="form-label">Copies Left</label>
                  <input type="number" id="copies" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label for="image" class="form-label">Image URL</label>
                  <input type="url" id="image" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Book</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
  
    document.getElementById('addBookForm').onsubmit = async (e) => {
      e.preventDefault();
      const newBook = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        genre_id: parseInt(document.getElementById('genre').value),
        copies_left: parseInt(document.getElementById('copies').value),
        image_url: document.getElementById('image').value,
      };
  
      try {
        await axios.post('/books', newBook);
        modal.hide();
        location.reload(); // Reload page to reflect changes
      } catch (err) {
        console.error('Error adding book:', err);
        alert('Failed to add book');
      }
    };
  }

  


function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const books = document.querySelectorAll('#booksContainer .card');
  
    books.forEach(book => {
      const title = book.querySelector('.card-title').textContent.toLowerCase();
      const author = book.querySelector('.card-text').textContent.toLowerCase();
  
      if (title.includes(query) || author.includes(query)) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });
  }

  

function filterByGenre() {
    const selectedGenre = document.getElementById('filterGenre').value;
    const books = document.querySelectorAll('#booksContainer .card');
  
    books.forEach(book => {
      const genre = book.getAttribute('data-genre-id');
  
      if (!selectedGenre || genre === selectedGenre) {
        book.style.display = 'block'; // Show the book
      } else {
        book.style.display = 'none'; // Hide the book
      }
    });
  }

  


async function editBook(id) {
    try {
      const book = await axios.get(`/books/${id}`);
      const bookData = book.data;
      const response_genre = await axios.get(`/genres/`);
      const genres = response_genre.data;
  
      const modalHTML = `
        <div class="modal" id="editBookModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Book</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="editBookForm">
                  <div class="mb-3">
                    <label for="editTitle" class="form-label">Title</label>
                    <input type="text" id="editTitle" class="form-control" value="${bookData.title}" required>
                  </div>
                  <div class="mb-3">
                    <label for="editAuthor" class="form-label">Author</label>
                    <input type="text" id="editAuthor" class="form-control" value="${bookData.author}" required>
                  </div>
                  <div class="mb-3">
                    <label for="editPrice" class="form-label">Price</label>
                    <input type="number" id="editPrice" class="form-control" step="0.01" value="${bookData.price}" required>
                  </div>
                  <div class="mb-3">
                    <label for="editGenre" class="form-label">Genre</label>
                    <select id="editGenre" class="form-select" required>
                      ${genres.map(genre => `<option value="${genre.id}" ${bookData.genre_id === genre.id ? 'selected' : ''}>${genre.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="editCopies" class="form-label">Copies Left</label>
                    <input type="number" id="editCopies" class="form-control" value="${bookData.copies_left}" required>
                  </div>
                  <div class="mb-3">
                    <label for="editImage" class="form-label">Image URL</label>
                    <input type="url" id="editImage" class="form-control" value="${bookData.image_url}" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
  
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
      modal.show();
  
      document.getElementById('editBookForm').onsubmit = async (e) => {
        e.preventDefault();
  
        const updatedBook = {
          title: document.getElementById('editTitle').value,
          author: document.getElementById('editAuthor').value,
          price: parseFloat(document.getElementById('editPrice').value),
          genre_id: parseInt(document.getElementById('editGenre').value),
          copies_left: parseInt(document.getElementById('editCopies').value),
          image_url: document.getElementById('editImage').value,
        };
  
        try {
          await axios.put(`/books/${id}`, updatedBook);
          modal.hide();
          location.reload(); // Reload page to reflect changes
        } catch (err) {
          console.error('Error updating book:', err);
          alert('Failed to update book');
        }
      };
    } catch (err) {
      console.error('Error fetching book details:', err);
      alert('Failed to fetch book details');
    }
  }


  async function viewBook(id) {
    try {
      // Fetch book details from the server
      const response = await axios.get(`/books/${id}`);
      const book = response.data;
      const response_genre = await axios.get(`/genres/${book.genre_id}`);
      const genre = response_genre.data;
  
      // Create the modal HTML
      const modalHTML = `
        <div class="modal fade" id="viewBookModal" tabindex="-1" aria-labelledby="viewBookModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="viewBookModalLabel">View Book</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="text-center">
                  <img src="${book.image_url || 'https://via.placeholder.com/150'}" alt="${book.title}" class="img-fluid mb-3">
                </div>
                <h5>Title:</h5>
                <p>${book.title}</p>
                <h5>Author:</h5>
                <p>${book.author}</p>
                <h5>Price:</h5>
                <p>$${book.price.toFixed(2)}</p>
                <h5>Genre:</h5>
                <p>${genre.name || 'N/A'}</p>
                <h5>Copies Left:</h5>
                <p>${book.copies_left}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
  
      // Inject the modal into the DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);
  
      // Initialize and show the modal
      const modal = new bootstrap.Modal(document.getElementById('viewBookModal'));
      modal.show();
  
      // Remove the modal from the DOM when it's hidden
      document.getElementById('viewBookModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('viewBookModal').remove();
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      alert('Failed to fetch book details');
    }
  }
  



async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/books/${id}`);
        location.reload(); // Reload page to reflect changes
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book');
      }
    }
  }

  


  function openAddGenreModal() {
    const modalHTML = `
      <div class="modal" id="addGenreModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Genre</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="addGenreForm">
                <div class="mb-3">
                  <label for="genreName" class="form-label">Genre Name</label>
                  <input type="text" id="genreName" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Genre</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('addGenreModal'));
    modal.show();
  
    document.getElementById('addGenreForm').onsubmit = async (e) => {
      e.preventDefault();
      const newGenre = { name: document.getElementById('genreName').value };
  
      try {
        await axios.post('/genres', newGenre);
        modal.hide();
        location.reload(); // Reload page to reflect changes
      } catch (err) {
        console.error('Error adding genre:', err);
        alert('Failed to add genre');
      }
    };
  }



  

async function editGenre(id, name) {
    const modalHTML = `
      <div class="modal" id="editGenreModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Genre</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editGenreForm">
                <div class="mb-3">
                  <label for="editGenreName" class="form-label">Genre Name</label>
                  <input type="text" id="editGenreName" class="form-control" value="${name}" required>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('editGenreModal'));
    modal.show();
  
    document.getElementById('editGenreForm').onsubmit = async (e) => {
      e.preventDefault();
      const updatedGenre = { name: document.getElementById('editGenreName').value };
  
      try {
        await axios.put(`/genres/${id}`, updatedGenre);
        modal.hide();
        location.reload(); // Reload page to reflect changes
      } catch (err) {
        console.error('Error updating genre:', err);
        alert('Failed to update genre');
      }
    };
  }
  


  async function deleteGenre(id) {
    if (confirm('Are you sure you want to delete this genre?')) {
      try {
        await axios.delete(`/genres/${id}`);
        location.reload(); // Reload page to reflect changes
      } catch (err) {
        console.error('Error deleting genre:', err);
        alert('Failed to delete genre');
      }
    }
  }
  