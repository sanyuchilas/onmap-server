const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const placemarkRouter = require('./placemarkRouter')

router.use('/user', userRouter)
router.use('/placemark', placemarkRouter)

module.exports = router