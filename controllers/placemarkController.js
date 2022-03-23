const ApiError = require('../error/ApiError')
const {PlacemarkPrivate, Placemark, PlacemarkFriend} = require('../models/models')

class PlacemarkController {

  async createOne(req, res, next) {
    const {coordinates, icon, short_description, full_description, files, userId} = req.body

    console.log(coordinates, icon, short_description, full_description, files, userId)

    const placemark = await PlacemarkPrivate.create({coordinates: JSON.stringify(coordinates), icon, short_description, full_description, files, userId})

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
    const {placemarkId, coordinates, icon, short_description, full_description, files} = req.body

    await PlacemarkPrivate.update({coordinates, icon, short_description, full_description, files}, {where: {id: placemarkId}})
  }

  async getOne(req, res, next) {
    const {placemarkId} = req.query
    const placemark = await PlacemarkPrivate.findOne({where: {id: placemarkId}})

    return res.json(placemark)
  }
}

module.exports = new PlacemarkController()