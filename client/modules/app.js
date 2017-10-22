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
      var search = h('input.search.form-control', {placeholder: 'Search'})

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

        h('div.collapse.navbar-collapse#navbarContent',
          h('ul.navbar-nav',
            h('li.nav-item', h('a.nav-link', {href: '#' + id}, api.avatar_name(id))),
            h('li.nav-item', h('a.nav-link', {href: '#Private'}, 'Private')),
            h('li.nav-item', h('a.nav-link', {href: '#Mentions'}, 'Mentions')),
            h('li.nav-item', h('a.nav-link', {href: '#Key'}, 'Key')),
          ),
          h('form.search', { onsubmit: function (e) {
              //if (err) throw err
              window.location.hash = '?' + search.value
              e.preventDefault()
            }},
            search,
            h('button.btn.btn-primary.btn-search', 'Search')
          )
        )
      ))

      document.body.appendChild(screen)

      var search = h('input.search', {placeholder: 'Search'})


    }
  }
}
