const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User registered" });
        } else {
            return res.status(404).json({ message: "User already exists" });
        }
    }
    return res.status(404).json({ message: "Invalid username or password" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    // return all books
    return await res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    const book = await books[isbn];
    if (book) {
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    //Write your code here
    let author = req.params.author;
    let authorBooks = await Object.values(books).filter(
        (book) => book.author === author
    );

    if (authorBooks.length > 0) {
        return res.status(200).json({ booksbyauthor: authorBooks });
    }
    return res
        .status(404)
        .json({ message: `Books with author ${author} Not Found.` });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    //Write your code here
    let title = req.params.title;
    let titleBooks = await Object.values(books).filter(
        (book) => book.title === title
    );

    if (titleBooks.length > 0) {
        return res.status(200).json({ booksbytitle: titleBooks });
    }
    return res
        .status(404)
        .json({ message: `Book with title ${title} Not Found.` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
