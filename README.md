# graphite-promise

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Actions Status](https://github.com/ashpool/graphite-promise/workflows/Node.js%20Package/badge.svg)](https://github.com/ashpool/graphite-promise/actions)
[![Actions Status](https://github.com/ashpool/graphite-promise/workflows/Node%20CI/badge.svg)](https://github.com/ashpool/graphite-promise/actions)

## Status

Experimental/Unstable

## Usage

```typescript
import {GraphiteClient} from 'graphite-promise';

const client = new GraphiteClient('plaintext://127.0.0.1:2003/'
    || {hostedGraphiteKey: 'a key', url: 'graphite url'});
```

### Example

```js
client.write({ home: { indoor: { temp: 21.2 } } }, 1427727486200);
```

_This project began as a fork of https://github.com/felixge/node-graphite_

[npm-url]: https://npmjs.org/package/graphite-promise
[downloads-image]: http://img.shields.io/npm/dm/graphite-promise.svg
[npm-image]: http://img.shields.io/npm/v/graphite-promise.svg

