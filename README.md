# mediator

Namespaced pub/sub.

## install

```
$ component install avetisk/mediator
```

## usage

```javascript
var Mediator = require('mediator');
var mediator = new Mediator();

/**
 * Subscribe to namespace `user`.
 */
mediator.on('user', function (username) {
  console.log('something is happened with user ' + username + '!');
});

/**
 * Subscribe to namespace `user::signout`.
 */
mediator.on('user::signout', function (username, date) {
  console.log('user ' + username + ' signed out at ' + date);
});

/**
 * Publish on namespace `chat::message`.
 * Both `chat` and `chat::message` will be triggered
 */
mediator.trigger('user::signout', 'user123', new Date());
```

### API

#### `Mediator#on(ns, callback, [context])`

Subscribe to given namespace `ns`.

`callback` will be called with `context` (if given) on given namespace `ns` or sub-namespace.

#### `Mediator#once(ns, callback, [context])`

Same as `Mediator#on` but triggers only once.

#### `Mediator#off(ns, [callback])`

Unsubscribe all subscription for given namespace `ns`.

If `callback` given, will unsubscribe only subscription for given namespace *and* callback.

#### `Mediator#trigger(ns, [...])`

Call all callbacks for given namespace `ns` and its parents, if subscribed.

If more than one argument is given, pass them to callbacks.

## License

MIT licensed
