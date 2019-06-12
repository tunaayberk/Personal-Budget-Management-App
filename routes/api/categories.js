const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Category model
const Category = require("../../models/Category");
// Tag model
const Tag = require("../../models/Tag");
//Load Input Validation
const validateCreateInput = require("../../validation/create");

// @route   GET api/categories/test
// @desc    Tests categories route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Categories Works" }));

// @route   GET api/categories/all
// @desc    Get all categories
// @access  Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Category.find()
      .sort({ name: 1 })
      .then(categories => res.json(categories))
      .catch(err =>
        res.status(404).json({ nocategoriesfound: "No Categories found" })
      );
  }
);

// @route   POST api/categories
// @desc    Create category
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCreateInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newCategory = new Category({
      user: req.user.id,
      name: req.body.name,
      desc: req.body.desc,
      icon: req.body.icon
    });

    newCategory.save().then(category => res.json(category));
  }
);

// @route   DELETE api/categories/:category_id
// @desc    Delete category
// @access  Private
router.delete(
  "/:category_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Category.findById(req.params.category_id)
      .then(category => {
        // Check for record owner
        if (category.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        category.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ categorynotfound: "No category found" })
      );
  }
);

// @route   GET api/categories/user/:user_id
// @desc    Get categories of the user
// @access  Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Category.find({ user: req.params.user_id })
      /*
      If you want to include user table add this
      .populate("user") */
      .sort({ name: 1 })
      .then(categories => {
        if (!categories) {
          errors.nocategory = "There is no categories for this user";
          return res.status(404).json(errors);
        }
        res.json(categories);
      })
      .catch(err =>
        res
          .status(404)
          .json({ category: "There is no categories for this user" })
      );
  }
);

// @route   GET api/categories/:category_id
// @desc    Get category by category id
// @access  Private
router.get(
  "/:category_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Category.findById(req.params.category_id)
      .populate("user")
      .then(category => res.json(category))
      .catch(err =>
        res
          .status(404)
          .json({ nocategoryfound: "No category found with that ID" })
      );
  }
);

module.exports = router;
