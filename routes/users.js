const express = require("express");
const router = express.Router();
const uniqid = require("uniqid");
const AnonymousPosts = require("../models/AnonymousPosts");
const Avatars = require("@dicebear/avatars").default;
const sprites = require("@dicebear/avatars-identicon-sprites").default;

router.get("/", async function(req, res, next) {
  try {
    const posts = await AnonymousPosts.find();

    const avatars = new Avatars(sprites, {
      height: 40,
      width: 40,
      background: "%23000754",
      radius: 20
    });
    const svg = avatars.create(req.session.id);
    let postsAvatars = [];
    for (post in posts) {
      let commentAvatars = [];
      for (comment in posts[post].comments) {
        commentAvatars.push(
          avatars.create(posts[post].comments[comment].userID)
        );
      }
      postsAvatars.push({
        postAvatar: avatars.create(posts[post].anonymousId),
        commentAvatars: commentAvatars
      });
    }

    const topPosts = await AnonymousPosts.aggregate([
      {
        $project: {
          anonymousId: 1,
          content: 1,
          timeStamp: 1,
          images: 1,
          comments: 1,
          length: { $size: "$comments" }
        }
      },
      { $sort: { length: -1 } },
      { $limit: 3 }
    ]);
    let topPostsAvatars = [];
    for (post in topPosts) {
      let topPostsCommentAvatars = [];
      // console.log(post);
      for (comment in topPosts[post].comments) {
        topPostsCommentAvatars.push(
          avatars.create(topPosts[post].comments[comment].userID)
        );
      }
      topPostsAvatars.push({
        postAvatar: avatars.create(topPosts[post].anonymousId),
        commentAvatars: topPostsCommentAvatars
      });
    }

    res.render("users", {
      UserID: req.session.id,
      posts: posts.reverse(),
      avatar: svg,
      postAvatars: postsAvatars.reverse(),
      topPosts: topPosts,
      topPostsAvatars: topPostsAvatars
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
