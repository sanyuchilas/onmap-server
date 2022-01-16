const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

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
    const user = await User.create({email, role, password: hashPassword, name, avatar})
    const token = generateJwt(user.id, user.email, user.role, user.name, user.avatar)
    
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

    const token = generateJwt(user.id, user.email, user.role, user.name, user.avatar)
    return res.json({token})
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.avatar)
    return res.json({token})
  }

}

module.exports = new UserController()