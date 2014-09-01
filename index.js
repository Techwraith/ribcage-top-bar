'use strict';
var Base = require('ribcage-view')
  , Button = require('ribcage-button')
  , Menu = require('ribcage-menu')
  , _ = require('lodash')

var TopBar = Base.extend({

  className: 'top-bar'

, template: function () {
    return ''+
      '<div class="left-button-target"></div>'+
      '<div class="top-bar-title"></div>'+
      '<div class="menu-target"></div>'+
      '<div class="right-button-target"></div>'
  }

, beforeInit: function beforeInit(opts) {
    this.options = opts
  }

, afterRender: function () {
    var opts = this.options

    if (opts.left) this.setLeftButton(opts.left)
    if (opts.title) this.setTitle(opts.title, {show: true})
    if (opts.menu) this.setMenu(opts.menu, {show: true})
    if (opts.right) this.setRightButton(opts.right)
  }

, setLeftButton: function (btn) {
    var $holder = this.$('.left-button-target')
      , viewName = 'leftButton'

    this.setButton(btn, viewName, $holder)
  }

, setRightButton: function (btn) {
    var $holder = this.$('.right-button-target')
      , viewName = 'rightButton'

    this.setButton(btn, viewName, $holder)
  }

, setButton: function setButton(btn, viewName, $holder){
    if (!btn && this[viewName]) this[viewName].close()
    else if (this[viewName]) this[viewName].close(null, _.bind(this.appendButton, this, $holder, btn, viewName))
    else if (btn) this.appendButton($holder, btn, viewName)
  }

, createButton: function createButton(opts) {
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
    else return new Button(opts)
  }

, appendButton: function appendButton($holder, btn, viewName){
    this[viewName] = this.createButton(btn)
    this.appendSubview(this[viewName], $holder)
  }

, setMenu: function (opts, params) {

    if (!params) params = {}

    if (this.menu) this.menu.close(null, _.bind(this.addNewMenu, this, opts, params))
    else this.addNewMenu(opts, params)
  }

, addNewMenu: function addNewMenu(opts, params){
    this.menu = new Menu(opts)
    window.requestAnimationFrame(_.bind(function (){
      this.appendSubview(this.menu, this.$('.menu-target'))

      if (params.show) this.showMenu()
    }, this))
  }

, hideMenu: function () {
    this.$('.menu-target').toggleClass('hidden', true)
  }

, showMenu: function () {
    this.$('.menu-target').toggleClass('hidden', false)
  }

, setTitle: function (title, params) {
    if (!params) params = {}

    if(typeof title === 'string')
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
