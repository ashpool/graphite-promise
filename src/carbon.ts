import * as net from 'net';
import * as url from 'url';

export default class CarbonClient {
  serverUrl: string;

  hostedGraphiteKey: string;

  socket: net.Socket | undefined;

  constructor(properties: Record<string, string>) {
    this.serverUrl = properties.url;
    this.hostedGraphiteKey = properties.hostedGraphiteKey ? `${properties.hostedGraphiteKey}.`: '';
  }

  public async write(message: string): Promise<string> {
    const socket = await this.connect();
    socket.write(this.hostedGraphiteKey + message, 'utf-8');
    socket.destroy();
    return message;
  };

  private async connect(): Promise<net.Socket> {
    if (this.socket) {
      return this.socket;
    }
    const dsn = url.parse(this.serverUrl);
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
