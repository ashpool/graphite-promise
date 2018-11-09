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

  public write = (metrics: Record<string, number>[], timestamp: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      this._connect().then((socket: net.Socket) => {
        var lines = '';
        for (var path in metrics) {
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
    var self = this;
    return new Promise((resolve, reject) => {
      if (self._socket) {
        return resolve(self._socket);
      }
      var dsn = url.parse(self._url),
        port = parseInt(dsn.port, 10) || 2003,
        host = dsn.hostname,
        timeout = 1000,
        socket = new net.Socket();
      socket.setTimeout(timeout, () => {
        socket.destroy();
        reject(new Error('Socket timeout'));
      });
      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });
      self._socket = socket.connect(port, host, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(self._socket);
        }
      });
    });
  };

  public end = () => {
    var self = this;
    return new Promise(function (resolve) {
      if (self._socket) {
        self._socket.end();
      }
      resolve();
    });
  };
}


module.exports = CarbonClient;
