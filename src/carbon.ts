import * as net from 'net';
import * as url from 'url';
import { Config } from './types';

export class CarbonClient {
  url: string;

  hostedGraphiteKey: string;

  socket: net.Socket | undefined;

  constructor(config: Config) {
    this.url = config.url;
    this.hostedGraphiteKey = config.hostedGraphiteKey ? `${config.hostedGraphiteKey}.`: '';
  }

  public async write(message: string): Promise<string> {
    const socket = await this.connect();
    socket.write(this.hostedGraphiteKey + message, 'utf-8', () => socket.end());
    return message;
  };

  private async connect(): Promise<net.Socket> {
    if (this.socket && !this.socket.destroyed) {
      return this.socket;
    }
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

    this.socket = socket.connect(port, host, (err?: Error) => {
      if (err) {
        throw(err);
      }
    });

    return this.socket;
  };

  public async end() {
    if (this.socket) {
      this.socket.end();
    }
  };
}
