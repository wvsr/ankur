const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const ext = file.originalname.split('.').pop()
    cb(null, file.fieldname + '-' + timestamp + '.' + ext)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  fileFilter: fileFilter,
})

const handleCoverPhoto = upload.single('coverPhoto')
const handleProfilePicture = upload.single('profilePicture')

module.exports = {
  upload,
  handleCoverPhoto,
  handleProfilePicture,
}
