import * as net from 'net';
import * as url from 'url';

export class CarbonClient {
  public _url: string;
  public _hostedGraphiteKey: string;
  public _socket: net.Socket;

  constructor(properties: Record<string, string>) {
    this._url = properties.url;
    this._hostedGraphiteKey = properties.hostedGraphiteKey ? properties.hostedGraphiteKey + '.' : '';
  }

  public write = (metrics: Record<string, number>, timestamp: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      this._connect().then((socket: net.Socket) => {
        let lines = '';
        for (const path in metrics) {
          if (metrics.hasOwnProperty(path)) {
            lines += [path, metrics[path], timestamp].join(' ') + '\n';
          }
        }
        socket.write(this._hostedGraphiteKey + lines, 'utf-8', (err: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve(lines);
          }
        });
      }, (error: Error) => {
        reject(error);
      });
    });
  };

  private _connect = () => {
    return new Promise((resolve, reject) => {
      if (this._socket) {
        return resolve(this._socket);
      }
      const dsn = url.parse(this._url);
      const host = dsn.hostname;
      const port = dsn.port ? parseInt(dsn.port, 10) : 2003;
      const timeout = 1000;
      const socket = new net.Socket();
      socket.setTimeout(timeout, () => {
        socket.destroy();
        reject(new Error('Socket timeout'));
      });
      socket.on('error', (err: Error) => {
        socket.destroy();
        reject(err);
      });
      this._socket = socket.connect(port, host, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(this._socket);
        }
      });
    });
  };

  public end = () => {
    return new Promise((resolve) => {
      if (this._socket) {
        this._socket.end();
      }
      resolve();
    });
  };
}
