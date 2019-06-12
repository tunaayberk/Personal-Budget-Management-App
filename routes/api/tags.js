const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation
const validateCreateInput = require("../../validation/create");

//Load Tag Model
const Tag = require("../../models/Tag");
// Load User Model
const User = require("../../models/User");

// @route   GET api/tags/test
// @desc    Test tags route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Tags Works" }));

// @route   GET api/tags/all
// @desc    Show all tags
// @access  Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tag.find()
      .sort({ name: 1 })
      .then(tags => res.json(tags))
      .catch(err => res.status(404).json({ norecordsfound: "No Tags found" }));
  }
);

// @route   POST api/tags
// @desc    Create a tag
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCreateInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Tag.findOne({ name: req.body.name }).then(tag => {
      if (tag) {
        errors.name = "Tag Name already exists";
        return res.status(400).json(errors);
      } else {
        const newTag = new Tag({
          user: req.user.id,
          name: req.body.name,
          desc: req.body.desc,
          icon: req.body.icon,
          image: req.body.image
        });

        newTag
          .save()
          .then(tag => res.json(tag))
          .catch(err => console.log(err));
      }
    });
  }
);

// @route   GET api/tags/user/:user_id
// @desc    Get current tags of the user
// @access  Private
router.get(
  "/user/:user_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Tag.find({ user: req.params.user_id })
      /* 
      If you want to include user table add this
      .populate("user") */
      .sort({ name: 1 })
      .then(tags => {
        if (!tags) {
          errors.notag = "There is no tags for this user";
          return res.status(404).json(errors);
        }
        res.json(tags);
      })
      .catch(err =>
        res.status(404).json({ tag: "There is no tags for this user" })
      );
  }
);

// @route   DELETE api/tag/:tag_id
// @desc    Delete user's tag
// @access  Private
router.delete(
  "/:tag_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Tag.findById(req.params.tag_id)
        .then(tag => {
          // Check for tag owner
          if (tag.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          tag.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ tagnotfound: "No tag found" }));
    });
  }
);

// @route   GET api/tags/:tag_id
// @desc    Get tag by tag id
// @access  Private
router.get(
  "/:tag_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tag.findById(req.params.tag_id)
      .populate("user")
      .then(tag => res.json(tag))
      .catch(err =>
        res.status(404).json({ notagfound: "No tag found with that ID" })
      );
  }
);

module.exports = router;
