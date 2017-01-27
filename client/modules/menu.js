var plugs = require('../plugs')
var h = require('hyperscript')

module.exports = {
  needs: {menu_items: 'map'},
  gives: {connection_status: true, menu: true},
  create: function (api) {
    var menu_items = api.menu_items

    var status = h('div.status.error')
    var list = h('div.menu.column')

    var menu = h('div.column', status, list)

    setTimeout(function () {
      menu_items().forEach(function (el) {
        if(el)
          list.appendChild(el)
      })
    }, 0)

    return {
      connection_status: function (err) {
        if(err) status.classList.add('error')
        else    status.classList.remove('error')
      },
      menu: function () {
        return menu
      }
    }
  }
}






