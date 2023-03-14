const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const { validationResult } = require('express-validator')

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  // validating req
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPhoto: user.coverPhoto,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  // validating req
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPhoto: user.coverPhoto,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.bio = req.body.bio || user.bio
    user.profilePicture = req.body.profilePicture || user.profilePicture
    user.coverPhoto = req.body.coverPhoto || user.coverPhoto

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      coverPhoto: updatedUser.coverPhoto,
    })
  } else {
    throw new Error('User not found')
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  // validating req
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const user = await User.findById(req.user._id)

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password changed successfully' })
  } else {
    res.status(401)
    throw new Error('Incorrect current password')
  }
})

// @desc    Upload profile photo
// @route   PUT /api/users/profile-picture
// @access  Private

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new Error('User not found')
  }
  if (req.file) {
    user.profilePicture = req.file.path
    await user.save()
    return res
      .status(200)
      .json({ message: 'Profile picture uploaded successfully' })
  } else {
    throw new Error('No file selected')
  }
})

// @desc    Upload cover photo
// @route   PUT /api/users/cover-picture
// @access  Private

const uploadCoverPhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new Error('User not found')
  }
  if (req.file) {
    user.coverPhoto = req.file.path
    await user.save()
    return res
      .status(200)
      .json({ message: 'Cover photo uploaded successfully' })
  } else {
    throw new Error('No file selected')
  }
})

// @desc Get single user by ID
// @route GET /api/users/:id
// @access Public
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    return res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Get logged in user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password')
  if (user) {
    return res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Get all users with pagination
// @route GET /api/users?page=1&limit=10
// @access Public

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const users = await User.find()
    .select('-password')
    .skip(startIndex)
    .limit(limit)

  const count = await User.countDocuments()

  const hasMore = endIndex < count

  res.status(200).json({
    users,
    hasMore,
  })
})

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  changePassword,
  uploadCoverPhoto,
  uploadProfilePicture,
  getUserById,
  getUserProfile,
  getUsers,
}
