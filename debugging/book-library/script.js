let myLibrary = [];


const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const checkInput = document.getElementById("check");

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages; // stored as a Number now, not a trimmed string
  this.read = !!read;
}

function populateStorage() {
  // Seed with a couple of books if library is empty
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

// Check the right input from forms and if it's ok -> add the new book (object in array)
// via Book function and start render function
function addBook() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pagesRaw = pagesInput.value.trim();
  const pages = Number(pagesRaw);

  // Preprocessing / validation:
  // - reject empty or whitespace-only title/author (checked AFTER trim, not before)
  // - reject non-numeric or non-positive page counts
  if (!title || !author || !pagesRaw || !Number.isFinite(pages) || pages <= 0) {
    alert("Please fill all fields with valid values!");
    return false;
  }

  const book = new Book(title, author, pages, checkInput.checked);
  myLibrary.push(book);

  // clear form inputs
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  checkInput.checked = false;

  render();
  return true;
}

function render() {
  const table = document.getElementById("display");
  const tbody = table.getElementsByTagName("tbody")[0];

  // Clear existing rows in one operation instead of removing one at a time
  tbody.innerHTML = "";

  myLibrary.forEach((book) => {
    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = book.title; // textContent: safe, no HTML parsing needed here
    row.appendChild(titleCell);

    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;
    row.appendChild(authorCell);

    const pagesCell = document.createElement("td");
    pagesCell.textContent = book.pages;
    row.appendChild(pagesCell);

    const readCell = document.createElement("td");
    const toggleReadBtn = document.createElement("button"); // consistent "Btn" suffix
    toggleReadBtn.className = "btn btn-sm btn-outline-primary";
    toggleReadBtn.textContent = book.read ? "Yes" : "No";
    toggleReadBtn.addEventListener("click", () => {
      book.read = !book.read;
      render();
    });
    readCell.appendChild(toggleReadBtn);
    row.appendChild(readCell);

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button"); // consistent "Btn" suffix
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      // Look up by object identity, not by closure-captured index,
      // so this stays correct even if myLibrary is ever reordered/filtered
      // by something other than a full render().
      const idx = myLibrary.indexOf(book);
      if (idx === -1) return;

      myLibrary.splice(idx, 1);
      render();
      // Show confirmation only AFTER the delete has actually completed,
      // and without a blocking window.alert().
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
    // Fallback if no toast container exists in the page yet.
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

// Single init call on page load — NOT called a second time elsewhere.
document.addEventListener("DOMContentLoaded", () => {
  populateStorage();
  render();
  document.getElementById("submitBtn").addEventListener("click", addBook);
});
