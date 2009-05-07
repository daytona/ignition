/**
 * @class This class makes it easy to handle URLs (like JSON URLs in
 * a complex XHR application), including placeholders.
 *
 * @constructor
 */
Ignition.Modules.UrlManager = function() {
};

/**
 * Adds a UrlManager to the specified ({@link Ignition}) object.
 * The manager is assigned to the <code>urlManager</code> property of the
 * object, with aliases to <code>{@link Ignition.Modules.UrlManager#add}</code>
 * as <code>object.addUrl</code> and
 * <code>{@link Ignition.Modules.UrlManager#compile}</code> as
 * <code>object.getUrl</code>.
 *
 * @param {Ignition} object A previously initialised <code>Ignition</code> object.
 */
Ignition.Modules.UrlManager.addTo = function(obj) {
  obj.urlManager = new Ignition.Modules.UrlManager();
  /** @ignore */
  obj.addUrl = function() { return this.urlManager.add.apply(obj.urlManager, arguments); };
  /** @ignore */
  obj.getUrl = function() { return this.urlManager.compile.apply(obj.urlManager, arguments); };
};

Ignition.Modules.UrlManager.prototype = {
  /** @property */
  _urls: {},

  /**
   * Add a new URL to the handler. The name is used to reference the URL later
   * on when using <code>compile</code>, the path is the actual path to the
   * resource (including placeholders with the syntax
   * <code>:placeholder</code>). Default values for the placeholder(s) can be
   * specified aswell.
   *
   * @example manager.add('post', '/posts/:category/:id.json', { category: 'news', id: 1 });
   *
   * @param {String} name Reference name for the URL
   * @param {String} path The path to the resource
   * @param {Object} [placeholders] Default values for the placeholders
   *     specified in <code>path</code>
   */
  add: function(name, path, defaults) {
    this._urls[name] = { path: path, defaults: defaults || {} }
  },

  /**
   * Retrieve the compiled version of a URL. If the the URL was originally
   * added with placeholders, you can specify replacements for these when
   * retrieving it.
   *
   * @example // Retrieve the JSON URL for a post with from the category 'tutorials' with ID 123
   * manager.compile('post', { category: 'tutorials', id: 123 });
   * // => "/posts/tutorials/123.json"
   *
   * @param {String} name Reference name for a previously added URL
   * @param {Object} [replacements] Replacements for placeholders in the URL
   */
  compile: function(name, replacements) {
    if (r = this._urls[name]) {
      var replacements = $.extend({}, r.defaults, replacements);
      var result = ''+r.path;
      for (key in replacements) {
        var re = new RegExp(':'+key, "g");
        result = result.replace(re, replacements[key]);
      }
      return result;
    } else {
      throw("Error: Url not found!");
    }
  }
};

