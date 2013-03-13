'use strict';

var defaults = require('defaults');

/**
 * Default config
 */
var defaultConfig = {
  'delimiter': '::'
};

/**
 * Expose `Mediator`
 */
var Mediator = function (config) {
  this.subs = {};
  this.config = defaults(config || {}, defaultConfig);
};

module.exports = Mediator;

/**
 * Subscribe
 *
 * @param {String} ns Namespace
 * @param {Function} callback Subscribe for a specific callback (optional)
 * @param {Mixed} context Callback context (optional)
 * @return {Mediator}
 */
Mediator.prototype.on = function (ns, callback, context, once) {
  this.subs[ns] = this.subs[ns] || [];
  this.subs[ns].push({
    'callback': callback,
    'context': context,
    'once': once || false
  });

  return this;
};

/**
 * Subscribe once
 *
 * @param {String} ns Namespace
 * @param {Function} callback Subscribe for a specific callback (optional)
 * @param {Mixed} context Callback context (optional)
 * @return {Mediator}
 */
Mediator.prototype.once = function (ns, callback, context) {
  this.on(ns, callback, context, true);

  return this;
};

/**
 * Unbscribe
 *
 * @param {String} ns Namespace
 * @param {Function} callback Unsubscribe for a specific callback (optional)
 * @return {Mediator}
 * @api public
 */
Mediator.prototype.off = function (ns, callback) {
  if (! callback) {
    this.subs[ns] = null;

    return this;
  }

  var subs = this.subs[ns];
  var len = subs.length;

  for (var subIndex = 0, sub; subIndex < len; subIndex += 1) {
    sub = subs[subIndex];

    if (sub.callback === callback) {
      subs.splice(subIndex, 1);
    }
  }

  return this;
};

/**
 * Trigger
 *
 * @param {String} ns Namespace
 * @return {Mediator}
 * @api public
 */
Mediator.prototype.trigger = function (ns) {
  var subs;
  var sub;
  ns = ns.split(this.config.delimiter);

  for (var nsIndex = 0, nsLen = ns.length; nsIndex < nsLen; nsIndex += 1) {
    subs = this.subs[ns.join(this.config.delimiter)];

    ns.pop();

    if (! subs) {
      continue;
    }

    for (var subIndex = 0, subLen = subs.length; subIndex < subLen; subIndex += 1) {
      sub = subs[subIndex];
      sub.callback.apply(
        sub.context,
        Array.prototype.slice.call(arguments)
      );

      if (sub.once) {
        subs.slice(subIndex, 1);
      }
    }
  }

  return this;
};
