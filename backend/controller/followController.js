const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// Add follower
const addFollower = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  const follower = await User.findById(req.user._id)

  if (user && follower) {
    if (!user.followers.includes(req.user._id)) {
      user.followers.push(req.user._id)
      await user.save()
    }

    if (!follower.following.includes(req.params.id)) {
      follower.following.push(req.params.id)
      await follower.save()
    }

    res.status(200).json({
      message: 'Follower added successfully.',
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// Remove follower
const removeFollower = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  const follower = await User.findById(req.user._id)

  if (user && follower) {
    user.followers = user.followers.filter(
      (follower) => follower.toString() !== req.user._id.toString()
    )
    await user.save()

    follower.following = follower.following.filter(
      (following) => following.toString() !== req.params.id.toString()
    )
    await follower.save()

    res.status(200).json({
      message: 'Follower removed successfully.',
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// Get followers with pagination
const getFollowers = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const user = await User.findById(req.params.id)
    .populate({
      path: 'followers',
      select: 'name email profilePicture',
      options: {
        limit: pageSize,
        skip: pageSize * (page - 1),
      },
    })
    .select('followers')

  if (user) {
    res.status(200).json({
      followers: user.followers,
      page,
      pages: Math.ceil(user.followers.length / pageSize),
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// Check if user follows someone
const checkFollows = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    const follows = user.followers.includes(req.user._id)
    res.status(200).json({
      follows,
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// Check if someone follows user
const checkFollowedBy = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    const followedBy = user.following.includes(req.user._id)
    res.status(200).json({
      followedBy,
    })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

module.exports = {
  addFollower,
  removeFollower,
  getFollowers,
  checkFollows,
  checkFollowedBy,
}
