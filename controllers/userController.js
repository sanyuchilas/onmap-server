const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Comrades, AddFriends, Friends, PlacemarkFriend} = require('../models/models')

const generateJwt = (id, email, role, name, avatar) => {
  return jwt.sign(
    {id, email, role, avatar, name}, 
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  )
}

class UserController {

  async registration(req, res, next) {
    const {email, password, role, name, avatar} = req.body

    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или пароль'))
    }
    
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует!'))
    }

    const hashPassword = await bcrypt.hash(password, 5)
    await User.create({email, role, password: hashPassword, name, avatar})
    
    return res.json({message: 'Регистариция успешно завершена'})
  }

  async login(req, res, next) {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if (!user) {
      return next(ApiError.internal('Пользователь с таким email не найден!'))
    }

    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль!'))
    }

    const token = generateJwt(user.id, user.email, user.role, user.name, user.avatar)
    return res.json({token})
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.avatar)
    return res.json({token})
  }

  async getFriends(req, res, next) {
    const {id} = req.query
    let data = {}
    if (id) {
      let comrades = await Comrades.findAll({where: {userId: id}})
      let addFriends = await AddFriends.findAll({where: {userId: id}})
      let friends = await Friends.findAll({where: {userId: id}})
      data.comrades = comrades.map(comrade => JSON.parse(comrade.comrade))
      data.addFriends = addFriends.map(addFriend => JSON.parse(addFriend.addFriend))
      data.friends = friends.map(friend => JSON.parse(friend.friend))
      return res.json(data)
    }
    return next(ApiError.internal('Возникла непредвиденная ошибка!'))
  }
  
  async getOne(req, res, next) {
    const {id} = req.query
    const user = await User.findOne({where: {id}})
    if (!user) {
      return next(ApiError.badRequest('Пользователя с таким ID не существует! Введите другой ID'))
    }
    return res.json(user)
  }

  async putFriends(req, res, next) {
    const {user, friend, event} = req.body

    if (event === 'delete') {

      // Удаляю метки друга
   
      // await PlacemarkFriend.destroy({where: {userId: user.id, friendId: friend.id}})
      
      // await PlacemarkFriend.destroy({where: {userId: friend.id, friendId: user.id}})

      // Удаляю друга

      let idArr = await PlacemarkFriend.findAll({where: {userId: user.id, friendId: friend.id}})
      idArr = idArr.map(placemark => JSON.parse(placemark.placemark).id)

      await Friends.destroy({where: {userId: user.id, friend: JSON.stringify(friend)}})

      await Friends.destroy({where: {userId: friend.id, friend: JSON.stringify(user)}})

      return res.json({idArr, message: 'Друг удалён'})

    } else if (event === 'accept' || event === 'decline') {
      
      await AddFriends.destroy({where: {addFriend: JSON.stringify(user), userId: friend.id}})

      await Comrades.destroy({where: {userId: user.id, comrade: JSON.stringify(friend)}})

      if (event === 'accept') {

        await Friends.create({friend: JSON.stringify(friend), userId: user.id})

        await Friends.create({friend: JSON.stringify(user), userId: friend.id})

        return res.json({message: 'Запрос принят'})
      } else {
        return res.json({message: 'Запрос отклонён'})
      }

    } else if (event === 'cancel') {

      await AddFriends.destroy({where: {addFriend: JSON.stringify(friend), userId: user.id}})

      await Comrades.destroy({where: {comrade: JSON.stringify(user), userId: friend.id}})

      return res.json({message: 'Ваш запрос отменён'})

    } else if (event === 'addFriend') {

      await Comrades.create({comrade: JSON.stringify(user), userId: friend.id})

      await AddFriends.create({addFriend: JSON.stringify(friend), userId: user.id})

      return res.json({message: 'Запрос отправлен'})
    }

    return next(ApiError.internal('Возникла непредвиденная ошибка!'))
  }

}

module.exports = new UserController()