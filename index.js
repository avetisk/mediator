'use strict';

var defaults = require('defaults');

var Mediator = function (config) {
  this.subs = {};
  this.config = defaults(config || {}, Mediator.config);
};

module.exports = Mediator;

/**
 * Default config
 */
Mediator.prototype.config = {
  'delimiter': '::'
};

Mediator.prototype.on = function (ns, callback, context, once) {
  this.subs[ns] = this.subs[ns] || [];
  this.subs[ns].push({
    'callback': callback,
    'context': context,
    'once': once || false
  });

  return this;
};

Mediator.prototype.once = function (ns, callback, context) {
  this.on(ns, callback, context, true);
};

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

Mediator.prototype.trigger = function (ns) {
  ns = ns.split(this.config.delimiter);
  var subs;
  var sub;

  for (var nsIndex = 0, nsLen = ns.length; nsIndex < nsLen; nsIndex += 1) {
    subs = this.subs[ns.join(this.config.delimiter)];

    if (! subs) {
      ns.pop();

      continue;
    }

    for (var subIndex = 0, subLen = subs.length; subIndex < subLen; subIndex += 1) {
      sub = subs[subIndex];
      sub.callback.apply(
        sub.context,
        Array.prototype.slice.call(arguments, 1)
      );

      if (sub.once) {
        subs.slice(subIndex, 1);
      }
    }
  }
};
