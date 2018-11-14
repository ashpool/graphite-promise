import {CarbonClient} from "./carbon";
import {Metric} from './metric';

export class GraphiteClient {
  public _carbonClient: CarbonClient;

  constructor(config: Record<string, string>) {
    this._carbonClient = new CarbonClient(config);
  }

  /**
   * Writes metric with timestamp to Graphite
   *
   * @param metrics an object with values, e.g. {home:{indoor:{temp:21.2}}}
   * @param timestamp defaults to Date.now()
   * @returns {Promise} a promise
   */
  public write (metrics: Record<string, any>, timestamp?: number): Promise<string> {
    let lines = '';
    for (const path in metrics) {
      if (metrics.hasOwnProperty(path)) {
        lines += [path, metrics[path], timestamp].join(' ') + '\n';
      }
    }
    return this._carbonClient.write(Metric.flatten(metrics), timestamp || Math.floor(Date.now() / 1000));
  };

  public end () {
    return this._carbonClient.end();
  };
}
