'use strict';
var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , Menu = require('ribcage-menu')
  , _ = require('lodash')

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
  }

, getButton: function (opts) {

    if (opts){
      // someone may have passed in an already built button
      // if so, just append it now
      if (typeof opts.render === 'function') {
        return opts
      }

      if (typeof opts === 'string') {
        return new Base({
          template: function() { return opts }
        })
      }
    }

    return new Button(opts)
  }

, setLeftButton: function (btn) {
    var holder = this.$('.left-button-target')
      , store = 'leftButton'

    if (this.leftButton) this.leftButton.close(null, _.bind(this.addButton, this, holder, btn, store))
    else this.addButton(holder, btn, store)
  }

, setRightButton: function (btn) {
    var holder = this.$('.right-button-target')
      , store = 'rightButton'

    if (this.rightButton) this.rightButton.close(null, _.bind(this.addButton, this, holder, btn, store))
    else this.addButton(holder, btn, store)
  }

, addButton: function addButton(holder, btn, store){
    holder.empty()
    this[store] = this.getButton(btn)
    this[store].$el.addClass('right')
    this.appendSubview(this[store], holder)
  }

, setMenu: function (opts, params) {

    if (!params) params = {}

    if (this.menu) this.menu.close()

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
        if (view.route === route) view.$el.addClass('active')
      })
    }.bind(this))
  }

})

module.exports = TopBar
