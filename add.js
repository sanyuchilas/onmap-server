const {PlacemarkPrivate, Placemark, PlacemarkFriend} = require('./models/models')

const add = () => {
  let templates = [
    [
      [51.17885736098834,-1.8261605410343302],
     '', 
     'https://earth.google.com/web/search/Stonehenge,+Solsberi,+UK'
    ],
  
  ]
  
  templates.map(async template => {

    let candidate = await Placemark.findOne({where: {coordinates: JSON.stringify(template[0])}})

    if (!candidate) Placemark.create({coordinates: JSON.stringify(template[0]), icon: template[1], model: template[2]})

  })
}

module.exports = {add}