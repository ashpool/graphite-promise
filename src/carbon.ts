import * as net from 'net';
import * as url from 'url';

export class CarbonClient {
  public _url: string;
  public _hostedGraphiteKey: string;
  public _socket: net.Socket | undefined;

  constructor(properties: Record<string, string>) {
    this._url = properties.url;
    this._hostedGraphiteKey = properties.hostedGraphiteKey ? properties.hostedGraphiteKey + '.' : '';
  }

  public async write(metrics: Record<string, number>, timestamp: number): Promise<string> {
    let lines = '';
    for (const path in metrics) {
      if (metrics.hasOwnProperty(path)) {
        lines += [path, metrics[path], timestamp].join(' ') + '\n';
      }
    }
    const socket = await this._connect();
    await socket.write(this._hostedGraphiteKey + lines, 'utf-8');
    return lines;
  };

  private async _connect(): Promise<net.Socket> {
    if (this._socket) {
      return this._socket;
    }
    const dsn = url.parse(this._url);
    const host = dsn.hostname || 'localhost';
    const port = dsn.port ? parseInt(dsn.port, 10) : 2003;
    const timeout = 1000;
    const socket = new net.Socket();

    socket.setTimeout(timeout, () => {
      socket.destroy();
      throw(new Error('Socket timeout'));
    });

    socket.on('error', (err: Error) => {
      socket.destroy();
      throw(err);
    });

    this._socket = socket.connect(port, host, (err: Error) => {
      if (err) {
        throw(err);
      }
    });

    return this._socket;
  };

  public async end() {
    if (this._socket) {
      this._socket.end();
    }
  };
}
