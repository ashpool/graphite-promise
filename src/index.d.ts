import net from 'net';

declare namespace GraphitePromise {
  export interface Config {
    url: string;
    hostedGraphiteKey?: string;
  }

  export class GraphiteClient {
    constructor(config: Config);

    write(metrics: Record<string, any>, timestamp?: number): Promise<string>;

    end(): void;
  }

  export class CarbonClient {
    constructor(config: Config);

    write(message: string): Promise<string>;

    connect(): Promise<net.Socket>;

    end(): void;
  }
}

export = GraphitePromise;
