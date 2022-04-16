const Router = require('express')
const router = new Router()
const fileMiddleware = require('../middleware/fileMiddleware')
const placemarkController = require('../controllers/placemarkController')

router.get('/getAllPrivate', placemarkController.getAllPrivate)
router.get('/getAllPublic', placemarkController.getAllPublic)
router.get('/getFriendsPlacemarks', placemarkController.getFriendsPlacemarks)
router.get('/getOnePublic', placemarkController.getOnePublic)
router.get('/getOnePrivate', placemarkController.getOnePrivate)

router.post('/createOne', fileMiddleware.any('files'), placemarkController.createOne)

router.put('/putOne', fileMiddleware.any('files'), placemarkController.putOne)

router.delete('/deleteOne', placemarkController.deleteOne)

module.exports = router