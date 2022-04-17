const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      console.log('------------------')
      cb(null, 'users-files/')
    } catch(e) {
      console.log(e)
    }
  },
  filename(req, file, cb) {
    try {
      console.log('------------------')
      cb(null, new Date().toISOString().split(':').join('.') + "--" + file.originalname)
    } catch(e) {
      console.log(e)
    }
  }
})

// const types = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
  // if (types.includes(file.mimetype)) {
  try {
    console.log('------------------')
    cb(null, true)
  } catch(e) {
    console.log(e)
  }
  // } else {
  //   cb(null, false)
  // }
}

module.exports = multer({storage, fileFilter})