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
    const flatMetrics = Metric.flatten(metrics);
    const ts = timestamp || Date.now();
    let lines = '';
    for (let path in flatMetrics) {
      if (flatMetrics.hasOwnProperty(path)) {
        let value = flatMetrics[path];
        lines += [path, value, ts].join(' ') + '\n';
      }
    }
    return this._carbonClient.write(lines);
  };

  public end () {
    return this._carbonClient.end();
  };
}
