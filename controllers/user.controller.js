const shortid = require("shortid");

const db = require("../db.js");

module.exports.index = (req, res) => {
  res.render("users/index", {
    users: db.get("users").value()
  });
};

module.exports.create = (req, res) => {
  req.body.id = shortid.generate();

  let errors = [];

  if (!req.body.name) {
    errors.push("Name is required.");
  }

  if (req.body.name.split("").length > 30) {
    errors.push("Name must be less than 30 characters.");
  }

  if (errors.length) {
    res.render("users/index", {
      users: db.get("users").value(),
      errors,
      values: req.body
    });

    return;
  }

  db.get("users")
    .push(req.body)
    .write();
  
  res.redirect("back");
};

module.exports.idUpdate = (req, res) => {
  let id = req.params.id;

  res.render("users/update-name", {
    id: id
  });
};

module.exports.update = (req, res) => {
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name })
    .write();

  res.redirect("/users");
};

module.exports.delete = (req, res) => {
  let id = req.params.id;

  db.get("users")
    .remove({ id: id })
    .write();

  res.redirect("back");
};
