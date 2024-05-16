//Create Book In The Local Storage
class Book {
  constructor(title, category, author, description, image) {
    this.title = title;
    this.category = category;
    this.author = author;
    this.description = description;
    this.image = image;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    if (document.querySelector("#book-list")) {
      books.forEach((book) => UI.addBookToList(book));
    } else if (document.querySelector(".container")) {
      books.forEach((book) => UI.addBookToHomePage(book));
    }
  }

  //Add The Book To The Book Template
  static addBookToHomePage(book) {
    const container = document.querySelector(".container");

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const bookLink = document.createElement("a");
    bookLink.href = `Template_book.html?title=${encodeURI(book.title)}`;
    bookLink.innerHTML = `
      <img src="Data/Photos/${book.image}" class="image" alt="${book.description}" />
      <h2>${book.title}</h2>
    `;

    bookDiv.appendChild(bookLink);
    container.appendChild(bookDiv);
  }

  // Add Book in the admin Edit Page Which Has Delete button and Edit Button
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.category}</td>
      <td>${book.author}</td>
      <td>${book.description}</td>
      <td><img src="../Data/Photos/${book.image}" style="max-width: 100px; max-height: 100px;" /></td>
      <td>
        <a href="#" class="btn btn-danger btn-sm delete" data-description="${book.description}">Delete</a>
        <a href="#" class="btn btn-primary btn-sm edit">Edit</a>
      </td>`;
    list.appendChild(row);
  }

  //Delete Function From the table and also from the local storage
  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      const description = element.getAttribute("data-description");
      element.parentElement.parentElement.remove(); // Remove from UI
      Store.removeBook(description); // Remove from local storage
      UI.showAlert("Book Removed", "success");
    }
  }

  //Edit the Book
  static editBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell, index) => {
      if (index !== 4) {
        // Exclude the image field
        const text = cell.textContent;
        cell.innerHTML =
          index === 3
            ? `<textarea>${text}</textarea>`
            : `<input type="text" value="${text}">`;
      } else {
        // Handle the image field
        const imageSrc = cell.querySelector("img").getAttribute("src");
        cell.innerHTML = `
            <input type="file" accept="image/*" id="image" onchange="UI.previewImage(event)"/>
            <img src="${imageSrc}" style="max-width: 100px; max-height: 100px;" id="image-preview" />
          `;
      }
    });

    el.textContent = "Save";
    el.classList.remove("edit");
    el.classList.add("save");
  }

  //To review the image in the table
  static previewImage(event) {
    const input = event.target;
    const preview = input.parentNode.querySelector("img");

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  }

  //The Function of save book

  static saveBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell, index) => {
      if (index !== 4) {
        // Exclude the image field
        if (cell.querySelector("input")) {
          const newValue = cell.querySelector("input").value;
          cell.textContent = newValue;
        } else if (cell.querySelector("textarea")) {
          const newValue = cell.querySelector("textarea").value;
          cell.textContent = newValue;
        }
      } else {
        // Handle the image field
        const input = cell.querySelector("input[type='file']");
        const imageSrc =
          input.files.length > 0 ? URL.createObjectURL(input.files[0]) : "";
        const imageName = input.files.length > 0 ? input.files[0].name : "";
        cell.innerHTML = `
          <img src="${imageSrc}" style="max-width: 100px; max-height: 100px;" id="image-preview" />
          <input type="hidden" name="image" value="${imageName}" />
        `;
      }
    });

    el.textContent = "Edit";
    el.classList.remove("save");
    el.classList.add("edit");

    const updatedBook = {
      title: cells[0].textContent,
      category: cells[1].textContent,
      author: cells[2].textContent,
      description: cells[3].textContent,
      image: cells[4].querySelector("input[type='hidden']").value, // Get image name
    };

    const rowIndex = row.rowIndex - 1; // adjust index for header row
    const books = Store.getBooks();
    books[rowIndex] = updatedBook;

    localStorage.setItem("books", JSON.stringify(books)); // Update local storage directly

    UI.showAlert("Book Updated", "success");
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#image").value = "";
  }
}

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

  static removeBook(description) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.description === description) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);

if (document.querySelector("#book-list")) {
  document.querySelector("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      UI.deleteBook(e.target);
    } else if (e.target.classList.contains("edit")) {
      UI.editBook(e.target);
    } else if (e.target.classList.contains("save")) {
      UI.saveBook(e.target);
    }
  });
}

if (document.querySelector("#book-form")) {
  document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const category = document.querySelector("#category").value;
    const author = document.querySelector("#author").value;
    const description = document.querySelector("#description").value;
    const image = document.querySelector("#image").files[0].name; // Get image name

    if (
      title === "" ||
      category === "" ||
      author === "" ||
      description === ""
    ) {
      UI.showAlert("Please fill in all fields", "danger");
    } else {
      const book = new Book(title, category, author, description, image);

      UI.addBookToList(book);
      Store.addBook(book);

      UI.showAlert("Book Added", "success");
      UI.clearFields();
    }
  });
}

//Form Validation
function validateForm() {
  var fullname = document.getElementById("fullname").value;
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Resetting error messages
  var x = document.querySelectorAll(".error");
  x.forEach(function (el) {
    el.innerHTML = "";
  });

  var isValid = true;

  // Validate full name
  if (fullname.trim() === "") {
    document.getElementById("fullname-error").innerHTML =
      "Please enter your full name";
    isValid = false;
  } else if (!validateFullname(fullname)) {
    document.getElementById("fullname-error").innerHTML =
      "Please enter your first and last name";
    isValid = false;
  }

  // Validate username
  if (username.trim() === "") {
    document.getElementById("username-error").innerHTML =
      "Please enter a username";
    isValid = false;
  } else if (!validateUsername(username)) {
    document.getElementById("username-error").innerHTML =
      "Username must be between 3 and 20 characters long and can only contain letters, digits, and underscores";
    isValid = false;
  }

  // Validate email
  if (email.trim() === "") {
    document.getElementById("email-error").innerHTML =
      "Please enter your email";
    isValid = false;
  } else if (!validateEmail(email)) {
    document.getElementById("email-error").innerHTML =
      "Please enter a valid email address";
    isValid = false;
  }

  // Validate password
  if (password.trim() === "") {
    document.getElementById("password-error").innerHTML =
      "Please enter a password";
    isValid = false;
  }
  // Validate password confirmation
  if (confirmPassword.trim() === "") {
    document.getElementById("confirmPassword-error").innerHTML =
      "Please confirm your password";
    isValid = false;
  } else if (password !== confirmPassword) {
    document.getElementById("confirmPassword-error").innerHTML =
      "Passwords do not match";
    isValid = false;
  } else {
    if (password.length < 8) {
      document.getElementById("password-error").innerHTML =
        "Password must be at least 8 characters long";
      isValid = false;
    } else if (password.length > 14) {
      document.getElementById("password-error").innerHTML =
        "Password must be at most 14 characters long";
      isValid = false;
    } else if (!validatePasswordComplexity(password)) {
      document.getElementById("password-error").innerHTML =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      isValid = false;
    }
  }

  return isValid;
}

// Function to validate the full name
function validateFullname(fullname) {
  var regFullname = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return regFullname.test(fullname);
}

// Function to validate email format
function validateEmail(email) {
  var regEmail =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  return regEmail.test(email);
}

function validateUsername(username) {
  var regUsername = /^(?=.{3,50}$)[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/;
  return regUsername.test(username);
}

function validatePasswordComplexity(password) {
  var hasUppercase = /[A-Z]/.test(password);
  var hasLowercase = /[a-z]/.test(password);
  var hasNumber = /\d/.test(password);
  var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

function resetForm() {
  document.getElementById("form").reset();
  document.getElementById("fullname-error").innerHTML = "";
  document.getElementById("username-error").innerHTML = "";
  document.getElementById("email-error").innerHTML = "";
  document.getElementById("password-error").innerHTML = "";
  document.getElementById("confirmPassword-error").innerHTML = "";
}

function validateFullNameInput() {
  var fullname = document.getElementById("fullname").value.trim();
  var fullnameError = document.getElementById("fullname-error");
  if (fullname === "") {
    fullnameError.textContent = "Please enter your full name";
  } else if (!validateFullname(fullname)) {
    fullnameError.textContent = "Please enter your first and last name";
  } else {
    fullnameError.textContent = "";
  }
}

function validateUsernameInput() {
  var username = document.getElementById("username").value.trim();
  var usernameError = document.getElementById("username-error");
  if (username === "") {
    usernameError.textContent = "Please enter a username";
  } else if (!validateUsername(username)) {
    usernameError.textContent =
      "Username must be between 3 and 20 characters long and can only contain letters, digits, and underscores";
  } else {
    usernameError.textContent = "";
  }
}

function validateEmailInput() {
  var email = document.getElementById("email").value.trim();
  var emailError = document.getElementById("email-error");
  if (email === "") {
    emailError.textContent = "Please enter your email";
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address";
  } else {
    emailError.textContent = "";
  }
}

function validatePasswordInput() {
  var password = document.getElementById("password").value.trim();
  var passwordError = document.getElementById("password-error");
  if (password === "") {
    passwordError.textContent = "Please enter a password";
  } else if (!validatePasswordComplexity(password)) {
    passwordError.textContent =
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters long";
  } else if (password.length > 14) {
    passwordError.textContent = "Password must be at most 14 characters long";
  } else {
    passwordError.textContent = "";
  }
}

function validateConfirmPasswordInput() {
  var confirmPassword = document.getElementById("confirmPassword").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPasswordError = document.getElementById("confirmPassword-error");
  if (confirmPassword === "") {
    confirmPasswordError.textContent = "Please confirm your password";
  } else if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match";
  } else {
    confirmPasswordError.textContent = "";
  }
}

// this functoin for search with book name or book author and display the data.
function search() {
  // Get the search query from the input field
  var query = document.getElementById("search-bar").value.trim().toLowerCase();

  // If the search query is empty, clear the search results container and return
  if (query === "") {
    document.getElementById("search-results").innerHTML = "";
    return;
  }

  // Retrieve books from local storage
  var books = JSON.parse(localStorage.getItem("books")) || [];

  // Filter books
  var matchedBooks = books.filter(function (book) {
    return book.title.toLowerCase().includes(query);
  });

  // Display the matched books
  var searchResultsContainer = document.getElementById("search-results");
  searchResultsContainer.innerHTML = "";

  if (matchedBooks.length === 0) {
    searchResultsContainer.innerHTML = "<p>No results found.</p>";
  } else {
    matchedBooks.forEach(function (book) {
      var result = document.createElement("div");
      result.classList.add("book");

      var titleLink = document.createElement("a");
      titleLink.textContent = book.title;
      titleLink.href =
        "Template_book.html?title=" + encodeURIComponent(book.title);

      result.appendChild(titleLink);

      // Append result to search results container
      searchResultsContainer.appendChild(result);
    });
  }
}

function populateUsersTable() {
  var users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from local storage or initialize an empty array

  var tableBody = document.querySelector("#users-table tbody");

  // Clear the table before populating it with new data
  tableBody.innerHTML = "";

  users.forEach(function (user, index) {
    if (!user.isAdmin) {
      // Check if user is not admin
      var row = tableBody.insertRow();

      // Insert cells with user data
      row.insertCell(0).textContent = index + 1; // ID
      row.insertCell(1).textContent = user.fullname; // Full Name
      row.insertCell(2).textContent = user.username; // Username
      row.insertCell(3).textContent = user.password; // Password
      row.insertCell(4).textContent = user.email; // Email

      // Create delete button
      var deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        deleteUser(index);
      });

      // Insert delete button into action cell
      var actionCell = row.insertCell(5);
      actionCell.appendChild(deleteBtn);
    }
  });
}

function deleteUser(index) {
  var users = JSON.parse(localStorage.getItem("users")); // Retrieve users from local storage

  if (users && users.length > index) {
    users.splice(index, 1); // Remove user from array
    localStorage.setItem("users", JSON.stringify(users)); // Update local storage

    // Repopulate table
    populateUsersTable();
  }
}

// signup.js

// Function to borrow a book
function borrowBook(book) {
  // Check if the user is logged in
  if (!isLoggedIn()) {
    alert("Login to borrow this book.");
    redirectToLogin();
    return;
  }

  let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  // Check if the book is already borrowed
  const alreadyBorrowed = borrowedBooks.some(
    (borrowedBook) => borrowedBook.title === book.title
  );

  if (alreadyBorrowed) {
    alert("This book is already borrowed.");
    return;
  }

  // Add the book to the borrowed books list
  borrowedBooks.push(book);
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

  // Redirect to borrowed books page
  window.location.href = "Borrow_book.html";
}

function redirectToLogin() {
  window.location.href = "login.html";
}

function displayBorrowedBooks() {
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
  const tbody = document.querySelector("#book-table tbody");

  tbody.innerHTML = "";

  borrowedBooks.forEach((book, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.category}</td>
      <td>${book.author}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  // Add event listener to delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      removeBookFromTable(index);
    });
  });
}

function removeBookFromTable(index) {
  let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
  borrowedBooks.splice(index, 1);
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  displayBorrowedBooks(); // Refresh the table
}

function handleSignupFormSubmission() {
  var isValid = validateForm(); // Perform form validation

  if (isValid) {
    var fullname = document.getElementById("fullname").value.trim();
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var isAdmin = document.getElementById("is_admin").checked; // Check if admin checkbox is checked

    // Retrieve existing users or initialize an empty array
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the username already exists
    var isUsernameTaken = users.some(function (user) {
      return user.username === username;
    });

    if (isUsernameTaken) {
      alert("Username already exists. Please choose a different one.");
      return false; // Prevent form submission
    }

    // Check if the email already exists
    var isEmailTaken = users.some(function (user) {
      return user.email === email;
    });

    if (isEmailTaken) {
      alert("This email has been used before. Please use a different one.");
      return false; // Prevent form submission
    }

    // Create a user object
    var user = {
      fullname: fullname,
      username: username,
      email: email,
      password: password,
      isAdmin: isAdmin, // Include isAdmin flag in the user object
    };

    // Push the user object to the array of users
    users.push(user);

    // Store the updated array of users in local storage
    localStorage.setItem("users", JSON.stringify(users));

    redirectToLogin();
  }

  // Ensure the form submission is prevented if validation fails
  return isValid;
}

// Other functions...

function handleLogin(userType) {
  var enteredUsername = document.getElementById("username-bar").value;
  var enteredPassword = document.getElementById("password-bar").value;

  if (!enteredUsername || !enteredPassword) {
    alert("Please enter both username and password.");
    return;
  }

  enteredUsername = enteredUsername.trim();
  enteredPassword = enteredPassword.trim();

  // Retrieve users from local storage
  var users = JSON.parse(localStorage.getItem("users")) || [];

  console.log("Users from localStorage:", users);

  // Find the user in the array
  var user = users.find(function (u) {
    return (
      u.username === enteredUsername &&
      u.password === enteredPassword &&
      ((userType === "admin" && u.isAdmin) ||
        (userType === "user" && !u.isAdmin))
    );
  });

  console.log("User found:", user);

  if (user) {
    if (userType === "admin" && user.isAdmin) {
      alert("Hello, " + user.fullname + "! Welcome back!");

      // Store user role in session storage
      sessionStorage.setItem("userRole", "admin");
      // Store username in session storage
      sessionStorage.setItem("username", user.username);
      window.location.href = "admin/adminhomepage.html"; // Redirect to admin page
    } else if (userType === "user" && !user.isAdmin) {
      alert("Hello, " + user.fullname + "! Welcome back!");

      // Store user role in session storage
      sessionStorage.setItem("userRole", "user");
      // Store username in session storage
      sessionStorage.setItem("username", user.username);
      window.location.href = "index.html"; // Redirect to user page
    } else {
      alert("Invalid user type");
    }
  } else {
    alert("Invalid username or password");
  }
}

function isLoggedIn() {
  const userRole = sessionStorage.getItem("userRole");
  console.log("User role:", userRole);
  return userRole !== null;
}

function isAdmin() {
  return sessionStorage.getItem("userRole") === "admin";
}

function logout() {
  // Clear session storage and redirect to index page
  sessionStorage.clear();
  localStorage.removeItem("borrowedBooks");
  window.location.href = "index.html";
}

function updateNavBar() {
  const navigation = document.getElementById("navigation");
  const isLoggedIn = sessionStorage.getItem("userRole") !== null;

  if (isLoggedIn) {
    // If logged in, replace "Login" and "Register" with "Logout"
    navigation.innerHTML = `
      <a href="index.html"><img src="/image/NewOfficialLogo.png" alt="Logo" /></a>
      <h3><a href="index.html">Home Page</a></h3>
      <h3><a href="categories.html">Categories</a></h3>
      <h3><a href="Borrow_book.html">Borrow Book</a></h3>
      <h3><a href="#" onclick="logout()">Logout</a></h3>
    `;
  } else {
    // If not logged in, display default navigation
    navigation.innerHTML = `
      <a href="index.html"><img src="..static/image/NewOfficialLogo.png" alt="Logo" /></a>
      <h3><a href="index.html">Home Page</a></h3>
      <h3><a href="categories.html">Categories</a></h3>
      <h3><a href="Borrow_book.html">Borrow Book</a></h3>
      <h3><a href="Login.html">Login</a></h3>
      <h3><a href="Signup.html">Register</a></h3>
    `;
  }
}

function redirectToSignup() {
  window.location.href = "signup.html";
}
