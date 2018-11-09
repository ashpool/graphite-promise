const Client = require('./carbon');
import { Metric } from './metric';

export class GraphiteClient {
  public carbonClient: any;

  constructor(config) {
    this.carbonClient = new Client(config)
  }

  /**
   * Writes metric with timestamp to Graphite
   *
   * @param metrics an object with values, e.g. {home:{indoor:{temp:21.2}}}
   * @param timestamp defaults to Date.now()
   * @returns {Promise} a promise
   */
  public write = function (metrics, timestamp) {
    timestamp = timestamp || Date.now();
    timestamp = Math.floor(timestamp / 1000);
    return this.carbonClient.write(Metric.flatten(metrics), timestamp);
  };

  public end = function () {
    return this.carbonClient.end();
  };
}

