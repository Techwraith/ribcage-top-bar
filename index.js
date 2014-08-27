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
      '<div class="top-bar-title"></div>'+
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
    var holder = this.$('.left-button-target')

    if (this.leftButton) this.leftButton.close({keepDom: false})

    window.requestAnimationFrame(function (){
      holder.empty()
      this.leftButton = this.getButton(btn)
      this.leftButton.$el.addClass('left')
      this.appendSubview(this.leftButton, holder)
    }.bind(this))
  }

, setRightButton: function (btn) {
    var holder = this.$('.right-button-target')

    if (this.rightButton) this.rightButton.close({keepDom: false})

    if (!btn) return

    window.requestAnimationFrame(function (){
      holder.empty()
      this.rightButton = this.getButton(btn)
      this.rightButton.$el.addClass('right')
      this.appendSubview(this.rightButton, holder)
    }.bind(this))
  }

, setMenu: function (opts, params) {

    if (!params) params = {}

    if (this.menu) this.menu.close({keepDom: false})

    window.requestAnimationFrame(function (){
      this.menu = new Menu(opts)
      this.appendSubview(this.menu, this.$('.menu-target'))

      if (params.show) this.showMenu()
    }.bind(this))
  }

, hideMenu: function () {
    this.$('.menu-target').toggleClass('hidden', true)
  }

, showMenu: function () {
    this.$('.menu-target').toggleClass('hidden', false)
  }

, setTitle: function (title, params) {
    if (!params) params = {}

    if(typeof title == 'string')
      this.$('.top-bar-title').html(title)
    else
      this.appendSubview(title, this.$('.top-bar-title'));

    if (params.show) this.showTitle()
  }

, hideTitle: function () {
    this.$('.top-bar-title').toggleClass('hidden', true)
  }

, showTitle: function () {
    this.$('.top-bar-title').toggleClass('hidden', false)
  }

, activateMenuItem: function (route) {
    window.requestAnimationFrame(function (){
      this.menu.$('.active').removeClass('active')
      this.menu.eachSubview(function (view) {
        if (view.options.route === route) view.$el.addClass('active')
      })
    }.bind(this))
  }

})

module.exports = TopBar
