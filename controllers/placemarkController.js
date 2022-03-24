const ApiError = require('../error/ApiError')
const {PlacemarkPrivate, Placemark, PlacemarkFriend} = require('../models/models')

class PlacemarkController {

  async createOne(req, res, next) {
    const {coordinates, icon, shortDescription, fullDescription, files, userId} = req.body

    console.log(coordinates, icon, shortDescription, fullDescription, files, userId)

    const placemark = await PlacemarkPrivate.create({coordinates: JSON.stringify(coordinates), icon, shortDescription, fullDescription, files, userId})

    return res.json({placemark, message: 'Метка успешно добавлена'})
  }

  async getAllPrivate(req, res, next) {
    const {userId} = req.query
    const placemarks = await PlacemarkPrivate.findAll({where: {userId}})

    return res.json(placemarks)
  }

  async getAllPublic(req, res, next) {
    const placemarks = await Placemark.findAll()
    return res.json(placemarks)
  }

  async getFriendsPlacemarks(req, res, next) {
    const {userId} = req.query
    const {placemarks} = await PlacemarkFriend.findOne({where: {userId}})

    return res.json(placemarks)
  }

  async putOne(req, res, next) {
    const {placemarkId, coordinates, icon, shortDescription, fullDescription, files} = req.body

    await PlacemarkPrivate.update({coordinates, icon, shortDescription, fullDescription, files}, {where: {id: placemarkId}})
  }

  async getOne(req, res, next) {
    const {placemarkId} = req.query
    const placemark = await PlacemarkPrivate.findOne({where: {id: placemarkId}})

    return res.json(placemark)
  }
}

module.exports = new PlacemarkController()