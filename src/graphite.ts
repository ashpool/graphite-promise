import CarbonClient from "./carbon";
import Metric from './metric';

export default class GraphiteClient {
  carbonClient: CarbonClient;

  constructor(config: Record<string, string>) {
    this.carbonClient = new CarbonClient(config);
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

    // const lines = Object.entries(flatMetrics).map(path => [path, flatMetrics[path], ts]).join('\n');

    let lines = '';
    for (const path in flatMetrics) { // eslint-disable-line no-restricted-syntax
      if ({}.hasOwnProperty.call(flatMetrics, path)) {
        const value = flatMetrics[path];
        lines += `${[path, value, ts].join(' ')}\n`;
      }
    }
    return this.carbonClient.write(lines);
  };

  public end () {
    return this.carbonClient.end();
  };
}
