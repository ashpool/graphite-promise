# graphite-promise

## Usage

```js
var graphite = require('graphite-promise'),
client = graphite.createClient(<Graphite URL>);
client.write(metric, timestamp)
  .then(function(){})
  .catch(function(reason){})
  .finally(function(){});
```
### Example

```js
client.write({home:{indoor:{temp:21.2}}}, 1427727486200);
```

This project began as a fork of https://github.com/felixge/node-graphite
