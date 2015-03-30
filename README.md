# graphite-promise

## Usage

```js
graphite = require('graphite-promise')

graphite.write(metric, timestamp).then(function(){}).catch(function(reason){}).finally(function(){});

```
Example:

```js
graphite.write({home:{indoor:{temp:21.2}}}, 1427727486200);
```

This project began as a fork of https://github.com/felixge/node-graphite
