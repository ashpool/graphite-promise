var RSVP = require('rsvp'),
    net = require('net'),
    url = require('url');

function CarbonClient (properties) {
    properties = properties || {};
    this._url = properties.url;
}

CarbonClient.prototype.write = function (metrics, timestamp) {
    var self = this;
    return new RSVP.Promise(function (resolve, reject) {
        var dsn = url.parse(self._url),
            port = parseInt(dsn.port, 10) || 2003,
            host = dsn.hostname,
        socket = new net.Socket();
        socket.on('data', function () {
            socket.destroy();
        });
        socket.connect(port, host, 1000, function (err) {
            if (!!err) {
                socket.destroy();
                reject(err);
            } else {
                var lines = '';
                for (var path in metrics) {
                    if (metrics.hasOwnProperty(path)) {
                        var value = metrics[path];
                        lines += [path, value, timestamp].join(' ') + '\n';
                    }
                }
                socket.write(lines, 'utf-8', function (err) {
                    if (err) {
                        socket.destroy();
                        reject(err);
                    } else {
                        resolve(lines);
                    }
                });
            }
        });
    });
};

module.exports = CarbonClient;
