var RSVP = require('rsvp'),
    net = require('net'),
    url = require('url');

function CarbonClient (properties) {
    properties = properties || {};
    this._url = properties.url;
    this._socket = properties.socket || null;
}

CarbonClient.prototype.write = function (metrics, timestamp) {
    var self = this;
    return new RSVP.Promise(function (resolve, reject) {
        self._connect().then(function (socket) {
            var lines = '';
            for (var path in metrics) {
                if (metrics.hasOwnProperty(path)) {
                    var value = metrics[path];
                    lines += [path, value, timestamp].join(' ') + '\n';
                }
            }
            socket.write(lines, 'utf-8', function (err) {
                return err && reject(err) || resolve(lines);
            });
        });
    });
};

CarbonClient.prototype._connect = function () {
    var self = this;
    return new RSVP.Promise(function (resolve, reject) {
        if (self._socket) {
            return resolve(self._socket);
        }
        var dsn = url.parse(self._url),
            port = parseInt(dsn.port, 10) || 2003,
            host = dsn.hostname,
            timeout = 1000;
            self._socket = new net.Socket();
        self._socket.setTimeout(timeout, function () {
            self.end();
            reject(new Error('Socket timeout'));
        });
        self._socket.connect(port, host, 1000, function (err) {
            return err && reject(err) || resolve(self._socket);
        });
    });
};

CarbonClient.prototype.end = function () {
    return new RSVP.Promise(function (resolve, reject) {
        try {
            resolve(this._socket && this._socket.end() && this._socket.destroy());
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = CarbonClient;
