import { CarbonClient } from './carbon';
import Metric from './metric';
import { Config } from './types';

export class GraphiteClient {
  carbonClient: CarbonClient;

  constructor(config: Config) {
    this.carbonClient = new CarbonClient(config);
  }

  /**
   * Writes metric with timestamp to Graphite
   *
   * @param metrics an object with values, e.g. {home:{indoor:{temp:21.2}}}
   * @param timestamp defaults to Date.now()
   * @returns {Promise} a promise
   */
  public write(metrics: Record<string, any>, timestamp?: number): Promise<string> {
    const flatMetrics = Metric.flatten(metrics);
    const ts = Math.floor((timestamp || Date.now()) / 1000);
    const lines = [];
    for (const path in flatMetrics) { // eslint-disable-line no-restricted-syntax
      if ({}.hasOwnProperty.call(flatMetrics, path)) {
        const value = flatMetrics[path];
        lines.push(`${path} ${value} ${ts}\n`);
      }
    }
    return this.carbonClient.write(lines.join());
  };

  public end() {
    return this.carbonClient.end();
  };
}
