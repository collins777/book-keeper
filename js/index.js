///////////////////////////////////////////////////////////// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

///////////////////////////////////////////////////////////////// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    // loop through all books in array, call addBookToList()
    books.forEach(book => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    // create a row to put into our table
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      // remove book if it contains delete class
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    // where will we put our div?
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);

    // remove element after 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

////////////////////////////////////////////////////////////// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, i) => {
      if (book.isbn === isbn) {
        // remove book from array
        books.splice(i, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

////////////////////////////////////////////////////////////////////// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//////////////////////////////////////////////////////////////////////// Event: Add a  Book
document.getElementById("book-form").addEventListener("submit", e => {
  e.preventDefault();

  // get form values
  title = document.getElementById("title").value;
  author = document.getElementById("author").value;
  isbn = document.getElementById("isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields.", "danger");
  } else {
    // instatiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    // add book to UI
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book);

    // show success message
    UI.showAlert("Book Added!", "success");

    // clear fields
    UI.clearFields();
  }
});

////////////////////////////////////////////////////////////////////// Event: Remove a Book
document.getElementById("book-list").addEventListener("click", e => {
  // remove book from UI
  UI.deleteBook(e.target);

  // remove book from store -- get the isbn
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show success message
  UI.showAlert("Book Removed", "success");

  //console.log(e.target);
});
