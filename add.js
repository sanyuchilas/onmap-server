const {PlacemarkPrivate, Placemark, PlacemarkFriend} = require('./models/models')

const add = () => {
  let templates = [
    [
      [51.17885736098834,-1.8261605410343302],
     '', 
     'https://earth.google.com/web/search/Stonehenge,+%D0%A1%D0%BE%D0%BB%D1%81%D0%B1%D0%B5%D1%80%D0%B8,+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B1%D1%80%D0%B8%D1%82%D0%B0%D0%BD%D0%B8%D1%8F/@51.178882,-1.826215,100.99352405a,632.71087081d,35y,0h,45t,0r/data=CqUBGnsSdQolMHg0ODczZTYzYjg1MGFmNjExOjB4OTc5MTcwZTJiY2QzZDJkZBnp6_ma5ZZJQCEqb0c4LTj9vyo6U3RvbmVoZW5nZSwg0KHQvtC70YHQsdC10YDQuCwg0JLQtdC70LjQutC-0LHRgNC40YLQsNC90LjRjxgCIAEiJgokCSxd8QoGl0lAEdE-7jjDlklAGTBEW_6XMf2_IS4BzGF0Pv2_KAI'
    ],
  
  ]
  
  templates.map(template => {
    Placemark.create({coordinates: JSON.stringify(template[0]), icon: template[1], model: template[2]})
  })
}

module.exports = {add}