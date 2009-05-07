/**
 * Base Model class. This is used to create all Models for
 * {@link Ignition} Objects. If you want, you can extend the base Model using
 * <code>jQuery.extend()</code>.
 *
 * @example $i.m.MyModel = new Ignition.Model({
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
 * @example // Extend the base Model:
 * jQuery.extend(Ignition.Model.prototype, {
 *   myCustomMethod: function() {
 *     alert('This method will be available for all Models.');
 *   }
 * });
 *
 * @constructor
 * @param {Object} [methods] A collection of methods to extend the base Model with
 */
Ignition.Model = function(methods) {
  if (methods && !(typeof methods == 'object')) {
    Ignition.error('Model creation error');
  } else {
    $.extend(this, methods);
  }
};

Ignition.Model.prototype = {
  /**
   * Get data from the specified URL as JSON data.
   * This is a wrapper for jQuery.ajax(), with a pre-set dataType of 'json'.
   * This method will use the callbacks you specify in the options, if any.
   * If you haven't specified any such callbacks for this method, the default
   * callbacks for the current Model object will be used, if available.
   *
   * Any additional options will be passed to the jQuery.ajax() function.
   *
   * $i.m.MyModel('/items.json', {
   *   success: function() {
   *     // Perform some actions when the XHR call is successful
   *   }
   * });
   *
   * @see http://docs.jquery.com/Ajax/jQuery.ajax
   *
   * @param {Object} [options]
   * @param {Function} options.success Called when the XHR call is successful
   * @param {Function} options.error Called when the XHR call isn't successful
   * @param {Function} options.beforeSend Called before starting the XHR transaction
   * @param {Function} options.complete Called after the XHR call is done, regardless if it is successful or not
   */
  json: function(url, options) {
    var model = this;
    var options = $.extend({
      success: model.success,
      error: model.error,
      beforeSend: model.beforeSend,
      complete: model.complete
    }, options, {
      url: url,
      dataType: 'json'
    });

    return $.ajax(options);
  },

  /**
   * Default success callback for Ajax calls. Overwrite this with your own.
   * @see jQuery API documentation
  */
  success: function() {},

  /**
   * Default error callback for Ajax calls. Overwrite this with your own.
   * @see jQuery API documentation
  */
  error: function() {},

  /**
   * Default beforeSend callback for Ajax calls. Overwrite this with your own.
   * @see jQuery API documentation
  */
  beforeSend: function() {},

  /**
   * Default complete callback for Ajax calls. Overwrite this with your own.
   * @see jQuery API documentation
  */
  complete: function() {}
};

