const expressAsyncHandler = require('express-async-handler')
const Comment = require('../models/commentModel')

// @desc    Create a new comment
// @route   POST /api/comment/:postId
// @access  Private
const createComment = expressAsyncHandler(async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    author: req.user._id,
    post: req.params.postId,
  })

  const savedComment = await comment.save()
  res.status(201).json(savedComment)
})

// @desc    Delete a comment
// @route   DELETE /api/comment/:commentId
// @access  Private
const deleteComment = expressAsyncHandler(async (req, res) => {
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    author: req.user._id,
  })
  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }
  await comment.delete()
  res.status(200).json({ message: 'Comment deleted successfully' })
})

// @desc    Create a new post
// @route   PUT /api/comment/:commentId
// @access  Private
const updateComment = expressAsyncHandler(async (req, res) => {
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    author: req.user._id,
  })
  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }
  comment.text = req.body.text
  const updatedComment = await comment.save()
  res.status(200).json(updatedComment)
})

// @desc    Get comment by id
// @route   GET /api/comment/:commentId
// @access  Private
const getCommentById = expressAsyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)

  if (!comment) {
    res.status(404)
    throw new Error('Comment not found')
  }

  res.json(comment)
})

// @desc    Get comments
// @route   GET /api/comment/:postId
// @access  Private
const getComments = expressAsyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Comment.countDocuments({ post: postId })
  const comments = await Comment.find({})
    .skip(pageSize * (page - 1))
    .limit(pageSize)

  res.json({ comments, page, pages: Math.ceil(count / pageSize) })
})

module.export = {
  createComment,
  deleteComment,
  updateComment,
  getCommentById,
  getComments,
}
