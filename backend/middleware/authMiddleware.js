const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authUser = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const { id } = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(id).select('-password')
      req.user = user
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('No token found')
  }
})

// check if the user is admin
const adminUser = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized')
  }
})

module.exports = {
  authUser,
  adminUser,
}
