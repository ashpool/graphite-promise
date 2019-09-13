# graphite-promise

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] 

[![Actions Status](https://github.com/ashpool/graphite-promise/actions/nodejs/badge.svg)](https://github.com/ashpool/graphite-promise/actions)

## Status

Experimental/Unstable

## Usage

```js
var graphite = require('graphite-promise'),
client = graphite.createClient(<graphite-url> e.g 'plaintext://127.0.0.1:2003/'
|| {hostedGraphiteKey: 'a key', url: 'graphite url'});
client.write(metric, timestamp)
  .then(function(){})
  .catch(function(reason){})
  .finally(function(){
    client.end();
  });
```

### Example

```js
client.write({ home: { indoor: { temp: 21.2 } } }, 1427727486200);
```

_This project began as a fork of https://github.com/felixge/node-graphite_

[npm-url]: https://npmjs.org/package/graphite-promise
[downloads-image]: http://img.shields.io/npm/dm/graphite-promise.svg
[npm-image]: http://img.shields.io/npm/v/graphite-promise.svg

