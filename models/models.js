const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  name: {type: DataTypes.STRING(64)},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
  avatar: {type: DataTypes.STRING, defaultValue: ''},
})

const Comrades = sequelize.define('comrades', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  comrade: {type: DataTypes.STRING, defaultValue: ''}
})

const AddFriends = sequelize.define('addfriends', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  addFriend: {type: DataTypes.STRING, defaultValue: ''}
})

const Friends = sequelize.define('friends', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  friend: {type: DataTypes.STRING, defaultValue: ''}
})

const PlacemarkPrivate = sequelize.define('placemarkprivate', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  coordinates: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING},
  shortDescription: {type: DataTypes.STRING, defaultValue: 'Описание отсутствует'},
  fullDescription: {type: DataTypes.STRING(1023), defaultValue: 'Описание отсутствует'},
  files: {type: DataTypes.STRING, defaultValue: ''},
})

const Placemark = sequelize.define('placemark', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  coordinates: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING},
  model: {type: DataTypes.STRING, defaultValue: ''},
  title: {type: DataTypes.STRING, defaultValue: ''},
  shortDescription: {type: DataTypes.STRING, defaultValue: ''},
})

const PlacemarkFriend = sequelize.define('placemarkfriend', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  placemark: {type: DataTypes.STRING(511), defaultValue: ''},
  friendId: {type: DataTypes.INTEGER}
})

module.exports = {
  User, Comrades, Placemark, AddFriends, PlacemarkPrivate, PlacemarkFriend, Friends
}

User.hasMany(Comrades)
Comrades.belongsTo(User)

User.hasMany(PlacemarkFriend)
PlacemarkFriend.belongsTo(User)

User.hasMany(Friends)
Friends.belongsTo(User)

User.hasMany(AddFriends)
AddFriends.belongsTo(User)

User.hasMany(PlacemarkPrivate)
PlacemarkPrivate.belongsTo(User)