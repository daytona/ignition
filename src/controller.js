/**
 * Base Controller class. This is used to create all Controllers for
 * {@link Ignition} Objects. If you want, you can extend the base Controller using
 * <code>jQuery.extend()</code>.
 *
 * @example $i.m.MyController = new Ignition.Controller({
 *   index: function() {
 *     // Load some data with MyModel, and present it using MyView:
 *     $i.m.MyModel.load($i.v.MyView.index);
 *   }
 * });
 *
 * @example // Calling:
 * $i.m.MyView.index();
 *
 * @example // Extend the base Controller:
 * jQuery.extend(Ignition.Controller.prototype, {
 *   myCustomMethod: function() {
 *     alert('This method will be available for all Controllers.');
 *   }
 * });
 *
 * @constructor
 * @param {Object} [methods] A collection of methods to extend the base Controller with
 */
Ignition.Controller = function(name, methods) {
  this.name = name;
  $.extend(this, methods);
};

