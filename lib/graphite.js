var client = require('./carbon'),
    metric = require('./metric');

function GraphiteClient (properties) {
    this._carbon = properties.carbon;
}

GraphiteClient.createClient = function (carbonDsn) {
    return new this({
        carbon: new client({dsn: carbonDsn})
    });
};

/**
 *
 * @param metrics an object with values, e.g. home:{indoor:{temp:21.2}}}
 * @param timestamp defaults to Date.now()
 * @returns {Promise} a promise
 */
GraphiteClient.prototype.write = function (metrics, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Math.floor(timestamp / 1000);
    return this._carbon.write(metric.flatten(metrics), timestamp);
};

GraphiteClient.prototype.end = function () {
    this._carbon.end();
};

module.exports = GraphiteClient;
