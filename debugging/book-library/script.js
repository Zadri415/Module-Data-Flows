const myLibrary = [];

const bookForm = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const checkInput = document.getElementById("check");

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = !!read;
}

function populateStorage() {
  if (myLibrary.length === 0) {
    const book1 = new Book("Robinson Crusoe", "Daniel Defoe", 252, true);
    const book2 = new Book(
      "The Old Man and the Sea",
      "Ernest Hemingway",
      127,
      true
    );
    myLibrary.push(book1, book2);
  }
}

function addBook() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pagesRaw = pagesInput.value.trim();
  const pages = Number(pagesRaw);

  // Native "required"/"min"/"step" already ran before this handler fires
  // (see bookForm's submit listener below), so this is a second layer
  // for things HTML attributes can't express, like whitespace-only text.
  if (!title || !author || !pagesRaw || !Number.isFinite(pages) || pages <= 0) {
    alert("Please fill all fields with valid values!");
    return false;
  }

  const book = new Book(title, author, pages, checkInput.checked);
  myLibrary.push(book);

  bookForm.reset();

  render();
  return true;
}

function render() {
  const table = document.getElementById("display");
  const tbody = table.getElementsByTagName("tbody")[0];

  tbody.innerHTML = "";

  myLibrary.forEach((book) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = book.title;
    row.appendChild(titleCell);

    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;
    row.appendChild(authorCell);

    const pagesCell = document.createElement("td");
    pagesCell.textContent = book.pages;
    row.appendChild(pagesCell);

    const readCell = document.createElement("td");
    const toggleReadBtn = document.createElement("button");
    toggleReadBtn.className = "btn btn-sm btn-outline-primary";
    toggleReadBtn.textContent = book.read ? "Yes" : "No";
    toggleReadBtn.addEventListener("click", () => {
      book.read = !book.read;
      render();
    });
    readCell.appendChild(toggleReadBtn);
    row.appendChild(readCell);

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const idx = myLibrary.indexOf(book);
      if (idx === -1) return;

      myLibrary.splice(idx, 1);
      render();
      showToast(`Deleted "${book.title}"`);
    });
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  });
}

function showToast(message, duration = 2000) {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.log(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addBook();
});

document.addEventListener("DOMContentLoaded", () => {
  populateStorage();
  render();
});
 
   
   

