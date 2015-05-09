var RSVP = require('rsvp'),
  net = require('net'),
  url = require('url');

function CarbonClient(properties) {
  if (typeof(properties) === 'string') {
    properties = { url: properties };
  }
  properties = properties || {};
  this._url = properties.url;
  this._apiKey = properties.apiKey || '';
  this._socket = properties.socket || null;
}

CarbonClient.prototype.write = function(metrics, timestamp) {
  var self = this;
  return new RSVP.Promise(function(resolve, reject) {
    self._connect().then(function(socket) {
      var lines = '';
      for (var path in metrics) {
        if (metrics.hasOwnProperty(path)) {
          var value = metrics[path];
          lines += [path, value, timestamp].join(' ') + '\n';
        }
      }
      socket.write(self._apiKey + lines, 'utf-8', function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(lines);
        }
      });
    }, function(error) {
      reject(error);
    });
  });
};

CarbonClient.prototype._connect = function() {
  var self = this;
  return new RSVP.Promise(function(resolve, reject) {
    if (self._socket) {
      return resolve(self._socket);
    }
    var dsn = url.parse(self._url),
      port = parseInt(dsn.port, 10) || 2003,
      host = dsn.hostname,
      timeout = 1000,
      socket = new net.Socket();
    socket.setTimeout(timeout, function() {
      socket.destroy();
      reject(new Error('Socket timeout'));
    });
    socket.on('error', function(err) {
      socket.destroy();
      reject(err);
    });
    self._socket = socket.connect(port, host, 1000, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(self._socket);
      }
    });
  });
};

CarbonClient.prototype.end = function() {
  return new RSVP.Promise(function(resolve) {
    if (this._socket) {
      this._socket.end();
    }
    resolve();
  });
};

module.exports = CarbonClient;
