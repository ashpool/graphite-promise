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
        var dsn = url.parse(self._url),
            port = parseInt(dsn.port, 10) || 2003,
            host = dsn.hostname;
            self._socket = new net.Socket({
                fd: null,
                allowHalfOpen: false,
                readable: false,
                writable: true
            });
        self._socket.on('data', function (data) {
            console.log('DATA: ' + data);
            // Close the client socket completely
            self.end();
        });
        self._socket.on('close', function () {
            console.log('Connection closed');
        });
        self._socket.connect(port, host, 1000, function (err) {
            if (!!err) {
                self.end();
                reject(err);
            } else {
                var lines = '';
                for (var path in metrics) {
                    if (metrics.hasOwnProperty(path)) {
                        var value = metrics[path];
                        lines += [path, value, timestamp].join(' ') + '\n';
                    }
                }
                self._socket.write(lines, 'utf-8', function (err) {
                    if (err) {
                        self.end();
                        reject(err);
                    } else {
                        resolve(lines);
                    }
                });
            }
        });
    });
};

CarbonClient.prototype.end = function () {
    return new RSVP.Promise(function (resolve, reject) {
        try {
            if (this._socket) {
                this._socket.end();
                this._socket.destroy();
                this._socket = null;
            }
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = CarbonClient;
