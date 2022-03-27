const Router = require('express')
const router = new Router()
const placemarkController = require('../controllers/placemarkController')

router.get('/getAllPrivate', placemarkController.getAllPrivate)
router.get('/getAllPublic', placemarkController.getAllPublic)
router.get('/getFriendsPlacemarks', placemarkController.getFriendsPlacemarks)
router.get('/getOnePublic', placemarkController.getOnePublic)
router.get('/getOnePrivate', placemarkController.getOnePrivate)

router.post('/createOne', placemarkController.createOne)

router.put('/putOne', placemarkController.putOne)

module.exports = router