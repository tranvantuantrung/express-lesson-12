const shortid = require("shortid");

const db = require("../db.js");

module.exports.index = (req, res) => {
  let books = db.get("books").value();
  let users = db.get("users").value();
  let transactions = db.get("transactions").value();

  let changeTrans = transactions.map(trans => {
    let book = books.find(book => book.id === trans.bookId);
    let user = users.find(user => user.id === trans.userId);

    return {
      bookTitle: book.title,
      userName: user.name,
      id: trans.id,
      isComplete: trans.isComplete
    };
  });

  res.render("transactions/index", {
    transactions: changeTrans,
    books,
    users
  });
};

module.exports.create = (req, res) => {
  req.body.id = shortid.generate();

  db.get("transactions")
    .push(req.body)
    .write();
  res.redirect("back");
};

module.exports.complete = (req, res) => {
  let id = req.params.id;

  db.get("transactions")
    .find({ id: id })
    .set("isComplete", true)
    .write();

  res.redirect("back");
};
