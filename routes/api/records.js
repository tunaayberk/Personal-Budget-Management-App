const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Record model
const Record = require("../../models/Record");
// Tag model
const Tag = require("../../models/Tag");
//Load Input Validation
const validateCreateInput = require("../../validation/create");

// @route   GET api/records/test
// @desc    Tests record route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Records Works" }));

// @route   GET api/records/all
// @desc    Get all records
// @access  Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Record.find()
      .sort({ date: -1 })
      .then(records => res.json(records))
      .catch(err =>
        res.status(404).json({ norecordsfound: "No Records found" })
      );
  }
);

// // @route   GET api/posts/:id
// // @desc    Get post by id
// // @access  Public
// router.get("/:id", (req, res) => {
//   Post.findById(req.params.id)
//     .then(post => res.json(post))
//     .catch(err =>
//       res.status(404).json({ nopostfound: "No post found with that ID" })
//     );
// });

// @route   POST api/records
// @desc    Create a record
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

    const newRecord = new Record({
      user: req.user.id,
      name: req.body.name,
      desc: req.body.desc,
      amount: req.body.amount
    });

    newRecord.save().then(record => res.json(record));
  }
);

// @route   DELETE api/records/:id
// @desc    Delete a record
// @access  Private
router.delete(
  "/:record_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Record.findById(req.params.record_id)
      .then(record => {
        // Check for record owner
        if (record.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        record.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ recordnotfound: "No record found" })
      );
  }
);

// @route   GET api/records/user/:user_id
// @desc    Get current records of the user
// @access  Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Record.find({ user: req.params.user_id })
      /* 
      If you want to include user table add this
      .populate("user") */
      .sort({ name: 1 })
      .then(records => {
        if (!records) {
          errors.norecord = "There is no records for this user";
          return res.status(404).json(errors);
        }
        res.json(records);
      })
      .catch(err =>
        res.status(404).json({ record: "There is no records for this user" })
      );
  }
);

// @route   GET api/records/:record_id
// @desc    Get record by record id
// @access  Private
router.get(
  "/:record_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Record.findById(req.params.record_id)
      .populate("user")
      .then(record => res.json(record))
      .catch(err =>
        res.status(404).json({ norecordfound: "No record found with that ID" })
      );
  }
);

module.exports = router;
