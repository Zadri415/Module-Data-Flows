let myLibrary = [];

window.addEventListener("load", function (e) {
  populateStorage();
  render();
});

function populateStorage() {
  // Seed with a couple of books if library is empty
  if (myLibrary.length === 0) {
    const book1 = new Book("Robinson Crusoe", "Daniel Defoe", "252", true);
    const book2 = new Book(
      "The Old Man and the Sea",
      "Ernest Hemingway",
      "127",
      true
    );
    myLibrary.push(book1, book2);
  }
}

const title = document.getElementById("title");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const check = document.getElementById("check");

//check the right input from forms and if its ok -> add the new book (object in array)
//via Book function and start render function
function addBook() {
  // basic validation
  if (!title.value || !author.value || !pages.value) {
    alert("Please fill all fields!");
    return false;
  }

  const book = new Book(
    title.value.trim(),
    author.value.trim(),
    pages.value.trim(),
    check.checked
  );
  myLibrary.push(book);
  // clear form inputs
  title.value = "";
  author.value = "";
  pages.value = "";
  check.checked = false;
  render();
  return true;
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  // store as boolean under a descriptive property
  this.read = !!read;
}

function render() {
  const table = document.getElementById("display");
  const tbody = table.getElementsByTagName("tbody")[0];
  // clear existing rows in tbody
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

  myLibrary.forEach((book, i) => {
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
        myLibrary.splice(i, 1);
        render();
      }
    });
    deleteCell.appendChild(delBut);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  });
}
