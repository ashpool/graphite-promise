import {CarbonClient} from "./carbon";
import {Metric} from './metric';

export class GraphiteClient {
  public _carbonClient: CarbonClient;

  constructor(config) {
    this._carbonClient = new CarbonClient(config);
  }

  /**
   * Writes metric with timestamp to Graphite
   *
   * @param metrics an object with values, e.g. {home:{indoor:{temp:21.2}}}
   * @param timestamp defaults to Date.now()
   * @returns {Promise} a promise
   */
  public write = function (metrics: Record<string, any>, timestamp: number) {
    return this._carbonClient.write(Metric.flatten(metrics), Math.floor((timestamp || Date.now()) / 1000));
  };

  public end = function () {
    return this._carbonClient.end();
  };
}

