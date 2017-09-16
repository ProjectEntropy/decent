var h = require('hyperscript')
var u = require('../util')
var pull = require('pull-stream')
var Scroller = require('pull-scroll')

exports.gives = {
  screen_view: true
}

exports.create = function (api) {
  return {
    screen_view: function (path, sbot) {
      if (localStorage.style === null) {
        localStorage.style = '.screen {background: red;}'
      }
      document.head.appendChild(h('style', localStorage.style))

      if(path === 'Theme') {
        var theme = h('textarea.theme', localStorage.style)
        var content = h('div.column.scroller__content')
        var div = h('div.column.scroller',
          {style: {'overflow':'auto'}},
          h('div.scroller__wrapper',
            h('div.column.scroller__content',
              theme,
              h('button', {onclick: function (e){
                if(theme.value) {
                  localStorage.style = theme.value 
                  e.preventDefault()
                  alert('Theme updated')
                }
                location.hash = ""
                location.reload()
              }}, 'Save')
            )
          )
        )
        return div
      }  
    }
  }
}

