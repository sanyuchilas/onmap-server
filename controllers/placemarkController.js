const ApiError = require('../error/ApiError')
const {PlacemarkPrivate, Placemark, PlacemarkFriend, User} = require('../models/models')

class PlacemarkController {

  async createOne(req, res, next) {
    let {coordinates, icon, shortDescription, fullDescription, files, userId, selectFriendsId} = req.body

    coordinates = JSON.stringify(coordinates)

    const {id} = await PlacemarkPrivate.create({coordinates, icon, shortDescription, fullDescription, files, userId})

    selectFriendsId.forEach(async friendId => {
      const {name} = await User.findOne({where: {id: userId}})
      PlacemarkFriend.create({placemark: JSON.stringify({
        id: id,
        coordinates,
        icon,
        friend: {userId, name}
      }), userId: friendId})
    })

    return res.json({placemark: {id, coordinates, icon}, message: 'Метка успешно добавлена'})
  }

  async getAllPrivate(req, res, next) {
    const {userId} = req.query
    const placemarks = await PlacemarkPrivate.findAll({where: {userId}})

    return res.json(placemarks.map(placemark => {
      const {id, coordinates, icon} = placemark
      return {id, coordinates, icon}
    }))
  }

  async getAllPublic(req, res, next) {
    const placemarks = await Placemark.findAll()
    return res.json(placemarks.map(placemark => {
      const {id, coordinates, icon, model} = placemark
      return {id, coordinates, icon, model}
    }))
  }

  async getFriendsPlacemarks(req, res, next) {
    const {userId} = req.query
    const placemarks = await PlacemarkFriend.findAll({where: {userId}})

    return res.json(placemarks.map(placemark => JSON.parse(placemark.placemark)))
  }

  async putOne(req, res, next) {
    const {placemarkId, coordinates, icon, shortDescription, fullDescription, files} = req.body

    await PlacemarkPrivate.update({coordinates, icon, shortDescription, fullDescription, files}, {where: {id: placemarkId}})
  }

  async getOnePublic(req, res, next) {
    const {id} = req.query
    const {shortDescription, title} = await Placemark.findOne({where: {id}})

    return res.json({shortDescription, title})
  }

  async getOneFriend(req, res, next) {
    const {id} = req.query
    const {shortDescription, title} = await Placemark.findOne({where: {id}})

    return res.json({shortDescription, title})
  }

  async getOnePrivate(req, res, next) {
    const {id} = req.query
    const placemark = await PlacemarkPrivate.findOne({where: {id}})

    return res.json(placemark)
  }
}

module.exports = new PlacemarkController()