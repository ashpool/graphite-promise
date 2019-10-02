import * as net from 'net';
import * as url from 'url';
import {Config} from "./types";

export default class CarbonClient {
  url: string;

  hostedGraphiteKey: string;

  constructor(config: Config) {
    this.url = config.url;
    this.hostedGraphiteKey = config.hostedGraphiteKey ? config.hostedGraphiteKey + '.' : '';
  }

  public async write(message: string, connection?: net.Socket): Promise<string> {
    const socket = connection || await this.connect();
    socket.write(this.hostedGraphiteKey + message, 'utf-8', () => socket.end());
    return message;
  };

  private async connect(): Promise<net.Socket> {
    const dsn = url.parse(this.url);
    const host = dsn.hostname || 'localhost';
    const port = dsn.port ? parseInt(dsn.port, 10) : 2003;
    const timeout = 3000;
    const socket = new net.Socket();

    socket.setTimeout(timeout, () => {
      socket.destroy();
      throw(new Error('Socket timeout'));
    });

    socket.on('error', (err: Error) => {
      socket.destroy();
      throw(err);
    });

    return socket.connect(port, host, (err?: Error) => {
      if (err) {
        throw(err);
      }
    });
  };
}
