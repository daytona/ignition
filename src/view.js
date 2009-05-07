/**
 * Base View class. This is used to create all Views for
 * {@link Ignition} Objects. If you want, you can extend the base View using
 * <code>jQuery.extend()</code>.
 *
 * @example $i.m.MyView = new Ignition.View({
 *   index: function(data) {
 *     // // Generate DOM elements based on data
 *   }
 * });
 *
 * @example // Calling:
 * $i.m.MyView.index();
 *
 * @example // Extend the base View:
 * jQuery.extend(Ignition.View.prototype, {
 *   myCustomMethod: function() {
 *     alert('This method will be available for all Views.');
 *   }
 * });
 *
 * @constructor
 * @param {Object} [methods] A collection of methods to extend the base View with
 */
Ignition.View = function(methods) {
  $.extend(this, methods);
};

