/**
 * Create DOM elements and start timers. An iframe is created if the user is
 * using IE, to support detection of back/forward navigation. Timers to check
 * if the window hash (or the iframe contents) have changed, and if so perform
 * the specified actions, are set using <code>setInterval()</code>.
 *
 * @class This class makes it possible to watch
 * the <code>window.location.hash</code> for changes, performing custom
 * actions when specific patterns are matched. This could potentially be used,
 * without modifications, independently of the Ignition framework aswell.
 *
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.interval=200] How often to check the location hash
 */
Ignition.Modules.HistoryDispatcher = function(options) {
  var options = $.extend({
    interval: 200
  }, options);

  var self = this;

  this._window.bind('hashchange', function() { self._triggerAction(); });

  this._engage(options);
};

/**
 * Clean a <code>window.location.hash</code> string. (Remove the '#' prefix.)
 * @param {String} hash A hash string (most probably from <code>window.location.hash</code>)
 */
Ignition.Modules.HistoryDispatcher.cleanHash = function(hash) {
  return hash.replace(/^#/, '');
};

/**
 * Adds a HistoryDispatcher to the specified ({@link Ignition}) object.
 * The Dispatcher is assigned to the <code>dispatcher</code> property of the
 * object, with aliases to
 * <code>{@link Ignition.Modules.HistoryDispatcher#addRoute}</code> as
 * <code>object.addRoutes</code> and
 * <code>{@link Ignition.Modules.HistoryDispatcher#go}</code> as
 * <code>object.go</code>.
 *
 * @param {Ignition} object A previously initialised <code>Ignition</code> object.
 */
Ignition.Modules.HistoryDispatcher.addTo = function(object) {
  /** @ignore */
  object.dispatcher = new Ignition.Modules.HistoryDispatcher();
  /** @ignore */
  object.addRoute   = function() { return this.dispatcher.addRoute.apply(this.dispatcher, arguments); };
  /** @ignore */
  object.go         = function() { return this.dispatcher.go.apply(this.dispatcher, arguments); };
};

Ignition.Modules.HistoryDispatcher.prototype = {
  /** @property */
  _window: $(window),

  /**
   * A map of the current routes that have been added to the object.
   * @property
   */
  routes: {},

  /** @property */
  _hash: '',

  /**
   * An Interval that checks if the location Hash has changed.
   * @property
   */
  timer: null,

  /** @property */
  __ie: false,

  /**
   * A reference to the DOM element of the generated iframe (if on IE).
   * @property
   */
  iframe: null,

  /**
   * A timer that watches the iframe for changes (if on IE).
   * @property
   */
  iframetimer: null,

  /** @function */
  _cleanHash: Ignition.Modules.HistoryDispatcher.cleanHash,

  /**
   * Add a new route. Specifies a pattern to be matched, and an action
   * (function) to be called when it is. The pattern can be a RegExp string,
   * and will be automatically surrounded by <code>^</code> and <code>$</code>
   * notations. RegExp back references will be used as arguments on the
   * specified function.
   *
   * @example // Add a new route to a previously defined HistoryDispatcher object:
   * dispatcher.addRoute('posts/(\\d+)', function(id) {
   *   alert('Matched post with ID '+id);
   * });
   *
   * @param {String} pattern A string, which can be a RegExp string. If so,
   *     you need to 'double escape', e.g. <code>"\d"</code> should be written
   *     as <code>"\\d"</code>.
   * @param {Function} action The action to be called when the pattern
   *     is matched.
   */
  addRoute: function(pattern, action) {
    var action = action || function(){};
    this.routes[pattern] = action;
  },

  /**
   * Go to a hash of your choice. The same as clicking a link with
   * <code>href="#(hash)"</code>.
   *
   * @example dispatcher.go('posts/123');
   * 
   * @param {String} hash
   */
  go: function(hash) {
    window.location.hash = '#'+hash;
  },

  /** @function */
  _triggerAction: function() {
    var hash = this._cleanHash(window.location.hash);
    this._hash = hash;

    this._updateIFrame(hash);

    for (pattern in this.routes) {
      var re = new RegExp('^'+pattern+'$');
      var matches = re.exec(hash);
      if (matches) {
        this.routes[pattern].apply(pattern, matches.slice(1,matches.length));
        return;
      }
    }
  },

  /** @function */
  _checkIFrameState: function() {
    if (!this.iframe) {
      var that = this;
      setTimeout(function() {
        that._checkIFrameState();
      }, 10);
      return;
    }

    var doc = this.iframe.contentWindow.document;
    var state = this._hash;
    var elem = doc.getElementById('hash');
    var newState = elem ? elem.innerText : '';

    if (newState != state) {
      this.iframetext = newState;
      window.location.hash = newState;
      this._window.trigger('hashchange');
    }
  },

  /** @function */
  _updateIFrame: function(hash) {
    if (!this.__ie) return;

    var content = '<html><body><div id="hash">'+hash+'</div></body></html>';

    if (!this.iframe) {
      var that = this;
      setTimeout(function() {
        that._updateIFrame(hash);
      }, 10);
      return content;
    }


    var doc = this.iframe.contentWindow.document;
    var elem = doc.getElementById('hash');
    var currentState = elem ? elem.innerText : '';
    if (hash != currentState) {
      doc.open();
      doc.write(content);
      doc.close();
    }

    return content;
  },

  /** @function */
  _engage: function(options) {
    var self = this;

    this.timer = setInterval(function() {
      var hash = self._cleanHash(window.location.hash);
      if (hash != self._hash) self._window.trigger('hashchange');
    }, options.interval);

    if (this.__ie = ($.browser.msie && parseInt($.browser.version) < 8)) {
      $(function() {
        var iframe = $('<iframe id="Ignition_history_iframe" style="display: none;"></iframe>');
        $('body').prepend(iframe);
        self.iframe = iframe.get(0);
        self.iframestate = self._hash || '';
      });

      this.iframetimer = setInterval(function() {
        self._checkIFrameState();
      }, options.interval);
    }
  },

  /**
   * Stop watching for history changes. Stops all timer. Use this if you don't
   * want to watch for history changes any more, for example if a page that
   * doesn't use the Ignition system is loaded.
   */
  disengage: function() {
    for (timer in [this.timer, this.iframetimer]) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }
};

