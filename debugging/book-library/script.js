const myLibrary = [];

window.addEventListener("load", function (e) {
  populateStorage();
  render();
});

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

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const checkInput = document.getElementById("check");

//check the right input from forms and if its ok -> add the new book (object in array)
//via Book function and start render function
function addBook() {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pagesRaw = pagesInput.value.trim();
  const pages = Number(pagesRaw);

  // Validate AFTER trimming, so whitespace-only input is rejected too
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

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages; // stored as a Number now, not a trimmed string
  // store as boolean under a descriptive property
  this.read = !!read;
}

function render() {
  const table = document.getElementById("display");
  const tbody = table.getElementsByTagName("tbody")[0];

  // Clear existing rows in one operation instead of removing one at a time
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

    const wasReadCell = document.createElement("td");
    const changeBut = document.createElement("button");
    changeBut.className = "btn btn-sm btn-outline-primary";
    changeBut.textContent = book.read ? "Yes" : "No";
    changeBut.addEventListener("click", () => {
      book.read = !book.read;
      render();
    });
    wasReadCell.appendChild(changeBut);
    row.appendChild(wasReadCell);

    const deleteCell = document.createElement("td");
    const delBut = document.createElement("button");
    delBut.className = "btn btn-sm btn-danger";
    delBut.textContent = "Delete";
    delBut.addEventListener("click", () => {
      if (confirm(`Delete "${book.title}"?`)) {
        // Look up by object identity, not by closure-captured index,
        // so this stays correct even if myLibrary is ever reordered
        // by something other than a full render().
        const idx = myLibrary.indexOf(book);
        if (idx === -1) return;
        myLibrary.splice(idx, 1);
        render();
      }
    });
    deleteCell.appendChild(delBut);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  });
}
