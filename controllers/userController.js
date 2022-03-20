const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Comrades, AddFriends} = require('../models/models')

const generateJwt = (id, email, role, name, avatar, friends) => {
  return jwt.sign(
    {id, email, role, avatar, name, friends}, 
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
    const user = await User.create({email, role, password: hashPassword, name, avatar})
    await Comrades.create({userId: user.id})
    await AddFriends.create({userId: user.id})
    const token = generateJwt(user.id, user.email, user.role, user.name, user.avatar, user.friends)
    
    return res.json({token})
  }

  async login(req, res, next) {
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    if (!user) {
      return next(ApiError.internal('Пользовыатель с таким email не найден!'))
    }

    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль!'))
    }

    const token = generateJwt(user.id, user.email, user.role, user.name, user.avatar, user.friends)
    return res.json({token})
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.avatar, req.user.friends)
    return res.json({token})
  }

  async getFriends(req, res, next) {
    const {id} = req.body
    let data = {}
    if (id) {
      let comrades = await Comrades.findOne({where: {userId: id}})
      let addFriends = await AddFriends.findOne({where: {userId: id}})
      let friends = await User.findOne({where: {id}})
      data.comrades = JSON.parse(comrades.comradeId)
      data.addFriends = JSON.parse(addFriends.friendId)
      data.friends = JSON.parse(friends.friends)
      return res.json(data)
    }
    return next(ApiError.internal('Возникла непредвиденная ошибка!'))
  }

  async putFriends(req, res, next) {
    const {id, friends, event} = req.body

    if (event === 'delete') {

      let user = await User.findOne({where: {id: friends.newFriendId}})

      let needFriends = JSON.parse(user.friends)
      needFriends = needFriends.filter(needId => needId !== id)

      await User.update({friends: JSON.stringify(needFriends)}, {where: {id: friends.newFriendId}})

      await User.update({friends: JSON.stringify(friends.friends)}, {where: {id}})
      return res.json({message: 'Друг удалён'})

    } else if (event === 'accept' || event === 'decline') {

      let {friendId} = await AddFriends.findOne({where: {userId: friends.newFriendId}})

      friendId = JSON.parse(friendId)
      friendId = friendId.filter(needId => needId !== id)

      await AddFriends.update({friendId: JSON.stringify(friendId)}, {where: {userId: friends.newFriendId}})

      if (event === 'decline') {

        await Comrades.update({comradeId: JSON.stringify(friends.comrades)}, {where: {userId: id}})

        return res.json({message: 'Запрос отклонён'})
      } else {

        let user = await User.findOne({where: {id: friends.newFriendId}})
        
        let needFriends = JSON.parse(user.friends)
        needFriends.push(id)

        await User.update({friends: JSON.stringify(needFriends)}, {where: {id: friends.newFriendId}})

        await Comrades.update({comradeId: JSON.stringify(friends.comrades)}, {where: {userId: id}})
        await User.update({friends: JSON.stringify(friends.friends)}, {where: {id}})

        return res.json({message: 'Запрос принят'})
      }

    } else if (event === 'cancel') {

      let {comradeId} = await Comrades.findOne({where: {userId: friends.newFriendId}})
      
      comradeId = JSON.parse(comradeId)
      comradeId = comradeId.filter(needId => needId !== id)

      await Comrades.update({comradeId: JSON.stringify(comradeId)}, {where: {userId: friends.newFriendId}})

      await AddFriends.update({friendId: JSON.stringify(friends.addFriends)}, {where: {userId: id}})

      return res.json({message: 'Ваш запрос отменён'})

    } else if (event === 'addFriend') {

      let {comradeId} = await Comrades.findOne({where: {userId: friends.newFriendId}})
      
      comradeId = JSON.parse(comradeId)
      comradeId.push(id)

      await AddFriends.update({friendId: JSON.stringify(friends.friends)}, {where: {userId: id}})
      await Comrades.update({comradeId: JSON.stringify(comradeId)}, {where: {userId: friends.newFriendId}})

      return res.json({message: 'Запрос отправлен'})

    }

    return next(ApiError.internal('Возникла непредвиденная ошибка!'))
  }

}

module.exports = new UserController()