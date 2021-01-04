const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const AnonymousPosts = require("../models/AnonymousPosts");
const { upload, uploadComment } = require("../config/multerStorageService");
const mongoose = require("mongoose");
const Avatars = require("@dicebear/avatars").default;
const sprites = require("@dicebear/avatars-identicon-sprites").default;

//Middleware

// @route     Post api/anonymousPosts/comment
// @desc      Publish a comment on a post
// @access    Public
router.post(
  "/comment",
  uploadComment.array("postImagesComment", 12),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).send({ errors: errors.array() });
      }
      const { commentContent, userID, postID, id } = req.body;
      const commentImages = req.files;
      const images = [];
      commentImages.forEach(item => {
        images.unshift({ imageTitle: item.originalname });
      });
      const posts = await AnonymousPosts.findOne({ anonymousId: postID });
      if (posts == null) {
        return res.status(404).send("Post not found");
      }
      posts.comments.unshift({ userID, commentContent, images });
      await posts.save();
      res.redirect(`/api/anonymousPosts/?pid=${id}`);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server error");
    }
  }
);

// @route     Post api/anonymousPosts
// @desc      Publish a post
// @access    Public
router.post(
  "/",
  [
    upload.array("postImages", 12),
    [
      check("userID", "User ID is required")
        .not()
        .isEmpty(),
      check("content", "Content is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { userID, content } = req.body;
      const postImages = req.files;
      if (!postImages) {
        return next(new Error("Please select an image"));
      }
      const postFields = {};
      postFields.anonymousId = userID;
      postFields.content = content;
      let post = new AnonymousPosts(postFields);
      postImages.forEach(item => {
        post.images.unshift({ imageTitle: item.originalname });
      });
      await post.save();
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server errror");
    }
  }
);

router.get("/:pid?", async (req, res) => {
  try {
    const avatars = new Avatars(sprites, {
      height: 40,
      width: 40,
      background: "%23000754",
      radius: 20
    });
    const post = await AnonymousPosts.findById(req.query.pid);
    let commentAvatars = [];

    for (comment in post.comments) {
      console.log(comment);
      commentAvatars.push(avatars.create(post.comments[comment].userID));
    }

    const postAvatars = {
      postAvatar: avatars.create(post.anonymousId),
      commentAvatars: commentAvatars
    };

    if (post.length == 0) {
      return res.status(404).send("No posts found");
    }
    res.render("userpost", {
      UserID: req.session.id,
      post: post,
      postAvatars: postAvatars
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route     Get api/anonymousPosts/
// @desc      Get all posts
// @access    Public

router.get("/", async (req, res) => {
  try {
    const posts = await AnonymousPosts.find();
    if (posts.length == 0) {
      return res.status(404).send("No posts found");
    }
    return res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }

  //   res.send("dasdasd");
});

module.exports = router;
