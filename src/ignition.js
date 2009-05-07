/**
 * The base class constructor.
 * You can specify Modules to load for the resulting object.
 *
 * @example var $i = new Ignition({ modules: ['UrlManager', 'HistoryDispatcher'] });
 *
 * @class The main class is intended to be instantiated as a 'wrapper' object,
 * which you would then use to work with your models, views and controllers.
 * <br/><br/>
 * You can use Modules (the built-in
 * <code>{@link Ignition.Modules.UrlManager}</code> and
 * <code>{@link Ignition.Modules.HistoryDispatcher}</code>) to get some, for these
 * kinds of XHR applications, commonly needed functionality for your
 * Ignition-based app.
 * <br/><br/>
 * Usage information can be found at
 * <a href="http://wiki.github.com/daytona/ignition">http://wiki.github.com/daytona/ignition</a>
 *
 * @constructor
 * @param [options] A object of options
 * @param {Array} options.modules An array of modules to load for the resulting Object
 */
var Ignition = window.Ignition = function(options) {
  var options = $.extend({
    modules: []
  }, options);

  for (var i = 0; i < options.modules.length; i++) {
    var module = options.modules[i];
    if (Ignition.Modules[module] && (typeof Ignition.Modules[module].addTo == 'function')) Ignition.Modules[module].addTo(this);
  }
};

/**
 * A map of the available Modules to load for an Ignition Object
 * @property
 */
Ignition.Modules = {};

Ignition.prototype = {
  /**
   * A map of the available Models
   * @property
   */
  m: {},

  /**
   * A map of the available Views
   * @property
   */
  v: {},

  /**
   * A map of the available Controllers
   * @property
   */
  c: {},

  /**
   * Add a new Model. An optional collection of methods
   * will be used to extend the base Model with <code>jQuery.extend()</code>.
   *
   * @example $i.m('MyModel', {
   *   load: function(callback) {
   *     // Load some content and peform the callback method
   *   },
   *   beforeSend: function() {
   *     // Overwriting the base Model's default beforeSend method
   *   }
   * });
   *
   * @example // Calling:
   * $i.m.MyModel.load();
   *
   * @param {String} name The name of the new Model
   * @param {Object} [methods] A collection of methods to extend the base Model with
   *
   * @returns {Ignition.Model}
   */
  m: function(name, methods) {
    this.m[name] = new Ignition.Model(methods);
    return this.m[name];
  },

  /**
   * Add a new View. An optional collection of methods
   * will be used to extend the base View with <code>jQuery.extend()</code>.
   *
   * @example $i.v('MyView', {
   *   index: function(data) {
   *     // Generate DOM elements based on data
   *   }
   * });
   *
   * @example // Calling:
   * $i.v.MyView.index(data);
   *
   * @param {String} name The name of the new View
   * @param {Object} [methods] A collection of methods to extend the base View with
   *
   * @returns {Ignition.View}
   */
  v: function(name, methods) {
    this.v[name] = new Ignition.View(methods);
    return this.v[name];
  },

  /**
   * Add a new Controller. An optional collection of
   * methods will be used to extend the base Controller with <code>jQuery.extend()</code>.
   *
   * @example $i.c('MyController', {
   *   index: function() {
   *     // Load some data with MyModel, and present it using MyView:
   *     $i.m.MyModel.load($i.v.MyView.index);
   *   }
   * });
   *
   * @example // Calling:
   * $i.c.MyController.index();
   *
   * @param {String} name The name of the new Controller
   * @param {Object} [methods] A collection of methods to extend the base Controller with
   *
   * @returns {Ignition.Controller}
   */
  c: function(name, methods) {
    this.c[name] = new Ignition.Controller(name, methods);
    return this.c[name];
  }
};

