var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , Menu = require('ribcage-menu')

var TopBar = Base.extend({

  afterInit: function (opts) {
    this.options = opts
  }

, events: {
    'click .left-button-target': 'propagateLeft'
  , 'click .right-button-target': 'propagateRight'
  }

, template: function () {
    return ''+
      '<div class="left-button-target"></div>'+
      '<div class="title"></div>'+
      '<div class="menu-target"></div>'+
      '<div class="right-button-target"></div>'
  }

, propagateLeft: function (e) {
    if(this.leftButton && e.target.classList.contains('left-button-target')) {
      e.stopPropagation()
      this.leftButton.$el.triggerHandler('click')
    }
  }

, propagateRight: function (e) {
    if(this.rightButton && e.target.classList.contains('right-button-target')) {
      e.stopPropagation()
      this.rightButton.$el.triggerHandler('click')
    }
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

    if (typeof opts == 'string') {
      return new Base({
        template: function() { return opts }
      })
    }

    return new Button(opts)
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
    this.$('.title').hide()
  }

, setTitle: function (title, params) {
    if (!params) params = {}

    if(typeof title == 'string')
      this.$('.title').html(title)
    else
      this.appendSubview(title, this.$('.title'));

    if (params.show) this.showTitle()
  }

, hideTitle: function () {
    this.$('.title').hide()
  }

, showTitle: function () {
    this.$('.title').show()
    this.$('.menu-target').hide()
  }

, activateMenuItem: function (route) {
    this.menu.$('.active').removeClass('active')
    this.menu.eachSubview(function (view) {
      if (view.options.route == route) view.$el.addClass('active')
    })
  }

})

module.exports = TopBar
