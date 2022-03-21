const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/getFriends', userController.getFriends)

router.put('/putFriends', userController.putFriends)

router.get('/auth', authMiddleware, userController.check)
router.get('/getOne', userController.getOne)

module.exports = router