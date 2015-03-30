var RSVP = require('rsvp'),
    net = require('net'),
    url = require('url');

function CarbonClient (properties) {
    properties = properties || {};
    this._dsn = properties.dsn;
    this._socket = properties.socket || null;
}

CarbonClient.prototype.write = function (metrics, timestamp) {
    var self = this;
    self._lazyConnect().then(function () {
    });
    return new RSVP.Promise(function (resolve, reject) {
        var lines = '';
        for (var path in metrics) {
            if (metrics.hasOwnProperty(path)) {
                var value = metrics[path];
                lines += [path, value, timestamp].join(' ') + '\n';
            }
        }

        self._socket.write(lines, 'utf-8', function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(metrics);
            }
        });
    });
};

CarbonClient.prototype._lazyConnect = function () {
    var self = this;
    return new RSVP.Promise(function (resolve, reject) {
        if (self._socket) {
            return resolve();
        }
        var dsn = url.parse(self._dsn),
            port = parseInt(dsn.port, 10) || 2003,
            host = dsn.hostname,
            socket = new net.Socket();
        self._socket = socket.connect(port, host, 1000, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

CarbonClient.prototype.end = function () {
    if (this._socket) {
        this._socket.end();
    }
};

module.exports = CarbonClient;
