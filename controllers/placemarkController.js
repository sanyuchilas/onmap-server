const ApiError = require('../error/ApiError')
const {Op} = require('sequelize')
const {PlacemarkPrivate, Placemark, PlacemarkFriend, User, Friends} = require('../models/models')

class PlacemarkController {

  async createOne(req, res, next) {
    let {coordinates, icon, shortDescription, fullDescription, files, userId, selectFriendsId} = req.body

    coordinates = JSON.stringify(coordinates)

    const {id} = await PlacemarkPrivate.create({coordinates, icon, shortDescription, fullDescription, files, userId})

    selectFriendsId.forEach(async friendId => {
      const {name} = await User.findOne({where: {id: userId}})
      PlacemarkFriend.create({placemark: JSON.stringify({
        coordinates,
        icon,
        friendName: name
      }), userId: friendId,  friendId: userId, placemarkId: id})
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

    // Получаем список id-шников друзей пользователя
    let friends = await Friends.findAll({where: {userId}})
    friends = friends.map(friend => JSON.parse(friend.friend).id)

    const placemarks = await PlacemarkFriend.findAll({
      where: {
        userId,
        // Проверяем, что пользователь действительно наш друг
        friendId: {
          [Op.or]: friends.length ? friends : [-1]
        }
      }
    })
    
    return res.json(placemarks.map(placemark => {
      let cur = JSON.parse(placemark.placemark)
      cur.id = placemark.placemarkId
      return {...cur}
    }))
  }

  async putOne(req, res, next) {
    const {coordinates, icon, shortDescription, fullDescription, files, userId, selectFriendsId} = req.body

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
    console.log(id)
    const placemark = await PlacemarkPrivate.findOne({where: {id}})

    return res.json(placemark)
  }
}

module.exports = new PlacemarkController()