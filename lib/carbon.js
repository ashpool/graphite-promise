var RSVP = require('rsvp'),
    LazySocket = require('lazy-socket'),
    url = require('url');

function CarbonClient (properties) {
    properties = properties || {};
    this._dsn = properties.dsn;
    this._socket = properties.socket || null;
}

CarbonClient.prototype.write = function (metrics, timestamp) {
    this._lazyConnect();
    return new RSVP.Promise(function (resolve, reject) {
        var lines = '';
        for (var path in metrics) {
            if (metrics.hasOwnProperty(path)) {
                var value = metrics[path];
                lines += [path, value, timestamp].join(' ') + '\n';
            }
        }

        this._socket.write(lines, 'utf-8', function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

CarbonClient.prototype._lazyConnect = function () {
    if (this._socket) {
        return;
    }

    var dsn = url.parse(this._dsn);
    var port = parseInt(dsn.port, 10) || 2003;
    var host = dsn.hostname;

    this._socket = LazySocket.createConnection(port, host, 1000);
};

CarbonClient.prototype.end = function () {
    if (this._socket) {
        this._socket.end();
    }
};

module.exports = CarbonClient;
