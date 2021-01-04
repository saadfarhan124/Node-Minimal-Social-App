const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  anonymousId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  images: [
    {
      imageTitle: {
        type: String
      }
    }
  ],
  comments: [
    {
      userID: {
        type: String,
        required: true
      },
      commentContent: {
        type: String,
        required: true
      },
      images: [
        {
          imageTitle: {
            type: String
          }
        }
      ],
      timeStamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = AnonymousPost = mongoose.model("anonymousPost", PostSchema);
