var CarbonClient = require('./carbon');

function GraphiteClient (properties) {
    this._carbon = properties.carbon;
}

GraphiteClient.createClient = function (carbonDsn) {
    return new this({
        carbon: new CarbonClient({dsn: carbonDsn})
    });
};

GraphiteClient.flatten = function (obj, flat, prefix) {
    flat = flat || {};
    prefix = prefix || '';

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (typeof value === 'object') {
                this.flatten(value, flat, prefix + key + '.');
            } else {
                flat[prefix + key] = value;
            }
        }
    }

    return flat;
};

GraphiteClient.prototype.write = function (metrics, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Math.floor(timestamp / 1000);
    return this._carbon.write(GraphiteClient.flatten(metrics), timestamp);
};

GraphiteClient.prototype.end = function () {
    this._carbon.end();
};

module.exports = GraphiteClient;
