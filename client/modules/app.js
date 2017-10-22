var h = require('hyperscript')
var id = require('../keys').id

module.exports = {
  needs: {
    screen_view: 'first',
    avatar_name: 'first',
    avatar_image: 'first'
  },
  gives: 'app',

  create: function (api) {
    return function () {
      document.head.appendChild(h('style', require('../style.css.json')))

      function hash() {
        return window.location.hash.substring(1)
      }

      var view = api.screen_view(hash() || 'Public')

      var screen = h('div.container.screen', view)
      var search_thing = h('input.search.form-control')

      window.onhashchange = function (ev) {
        var _view = view
        view = api.screen_view(hash() || 'Public')
        if(_view) screen.replaceChild(view, _view)
        else document.body.appendChild(view)
      }


      document.body.appendChild(h('nav.navbar.navbar-expand-lg.navbar-light.bg-light.mb-1',
        h('a.navbar-brand', {href: '#'}, "Decent"),
        h('button.navbar-toggler',
          {
            type: "button",
            'data-toggle': "collapse",
            'data-target': "#navbarContent",
            'aria-controls': "navbarSupportedContent",
            'aria-expanded': "false",
            'aria-label': "Toggle navigation"
          },
          h('span.navbar-toggler-icon')
        ),

        h('div.collapse.navbar-collapse.justify-content-between#navbarContent',
          h('ul.navbar-nav',
            h('li.nav-item', h('a.nav-link', {href: '#' + id}, api.avatar_name(id))),
            h('li.nav-item', h('a.nav-link', {href: '#Private'}, 'Private')),
            h('li.nav-item', h('a.nav-link', {href: '#Mentions'}, 'Mentions')),
            h('li.nav-item', h('a.nav-link', {href: '#Key'}, 'Key')),
          ),
          h('form.search.form-inline', { onsubmit: function (e) {
              //if (err) throw err
              window.location.hash = '?' + search_thing.value
              e.preventDefault()
            }},
            search_thing,
            h('button.btn.btn-outline-success.my-2.my-sm-0', 'Search')
          )
        )
      ))

      document.body.appendChild(screen)

    }
  }
}
