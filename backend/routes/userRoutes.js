const express = require('express')
const { body } = require('express-validator')
const { authUser, adminUser } = require('../middleware/authMiddleware')
const {
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
} = require('../controller/userController')

const { handleCoverPhoto, handleProfilePicture } = require('../uttils/storage')

const router = express.Router()

// Get All Users
router
  .route('/')
  .get(authUser, adminUser, getUsers)
  .delete(authUser, deleteUser)
  .put(authUser, updateUser)

// Register User
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  registerUser
)

// Login User
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
)

// Change Password
router.put(
  '/change-password',
  authUser,
  [
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
    body(
      'newPassword',
      'Please enter a new password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  changePassword
)

// Upload Cover Photo
router.put('/upload-coverphoto', authUser, handleCoverPhoto, uploadCoverPhoto)

// Upload Profile Picture
router.put(
  '/upload-profile-picture',
  authUser,
  handleProfilePicture,
  uploadProfilePicture
)

// Get User By ID
router.get('/:id', authUser, getUserById)

// Get User Profile
router.get('/profile', authUser, getUserProfile)

export default router
