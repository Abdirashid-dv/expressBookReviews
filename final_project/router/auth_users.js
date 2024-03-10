const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    let user = users.find((user) => user.username === username);
    if (user) {
        return true;
    }
    return false;
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let user = users.find(
        (user) => user.username === username && user.password === password
    );
    if (user) {
        return true;
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(404)
            .json({ message: "Invalid username or password" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ data: username }, "fingerprint_customer", {
            expiresIn: 60 * 60,
        });

        req.session.authorization = {
            token,
            username,
        };
        return res.status(200).json({ message: "User successfully logged in" });
    }

    return res
        .status(208)
        .json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.session.authorization.username;
    const book = books[isbn];
    if (book) {
        if (review) {
            book.reviews[user] = review;
            return res.status(200).json({ message: "Review added" });
        }
        return res.status(404).json({ message: "Invalid review" });
    }
    return res.status(404).json({ message: "Book not found" });
});

//deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Write your code here
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
    const book = books[isbn];
    if (book) {
        if (book.reviews[user]) {
            delete book.reviews[user];
            return res.status(200).json({ message: "Review deleted" });
        }
        return res.status(404).json({ message: "Review not found" });
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
