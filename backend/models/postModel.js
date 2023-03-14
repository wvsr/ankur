const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      default: [],
    },
  ],
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
