var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , Menu = require('ribcage-menu')

var TopBar = Base.extend({

  afterInit: function (opts) {
    this.options = opts
  }

, template: function () {
    return ''+
      '<div class="left-button-target"></div>'+
      '<div class="title hidden"></div>'+
      '<div class="menu-target"></div>'+
      '<div class="right-button-target"></div>'
  }

, className: 'top-bar'

, afterRender: function () {

    var opts = this.options

    if (opts.left) this.setLeftButton(opts.left)
    if (opts.title) this.setTitle(opts.title, {show: true})
    if (opts.menu) this.setMenu(opts.menu, {show: true})
    if (opts.right) this.setRightButton(opts.right)

    this.eachSubview(function (subview) {
      subview.render();
      subview.delegateEvents();
    });

  }

, getButton: function (opts) {

    // someone may have passed in an already built button
    // if so, just append it now
    if (typeof opts.render == 'function') {
      return opts
    }

    var self = this
      , button = new Button(opts);

    return button;
  }

, setLeftButton: function (btn) {

    if (this.leftButton) this.leftButton.close()

    this.leftButton = this.getButton(btn)
    this.leftButton.$el.addClass('left')
    this.appendSubview(this.leftButton, this.$('.left-button-target'))

  }

, setRightButton: function (btn) {

    if (this.rightButton) this.rightButton.close()

    if (!btn) return

    this.rightButton = this.getButton(btn)
    this.rightButton.$el.addClass('right')
    this.appendSubview(this.rightButton, this.$('.right-button-target'))

  }

, setMenu: function (opts, params) {

    if (!params) params = {}

    if (this.menu) this.menu.close()

    this.menu = new Menu(opts)
    this.appendSubview(this.menu, this.$('.menu-target'))

    if (params.show) this.showMenu()

  }

, hideMenu: function () {
    this.$('.menu-target').hide()
  }

, showMenu: function () {
    this.$('.menu-target').show()
  }

, setTitle: function (title, params) {
    if (!params) params = {}
    this.$('.title').html(title)
    if (params.show) this.showTitle()
  }

, hideTitle: function () {
    this.$('.title').hide()
  }

, showTitle: function () {
    this.$('.title').show()
  }

, activateMenuItem: function (route) {
    this.menu.$('.active').removeClass('active')
    this.menu.eachSubview(function (view) {
      if (view.options.route == route) view.$el.addClass('active')
    })
  }

})

module.exports = TopBar
