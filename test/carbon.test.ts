import * as net from 'net';
import {
  anyFunction,
  anyString,
  instance,
  mock,
  verify,
  when,
} from 'ts-mockito';
import { CarbonClient } from '../src/carbon';

describe('CarbonClient', () => {
  let socketMock: net.Socket;
  let socket: net.Socket;

  describe('#write', () => {
    beforeEach(() => {
      socketMock = mock(net.Socket);
      socket = instance(socketMock);
    });

    it('writes api key on socket', async () => {
      // Given
      const client = new CarbonClient({
        hostedGraphiteKey: 'YOUR-API-KEY',
        url: 'plaintext://127.0.0.1:2003/',
      });
      client.socket = socket;

      // When
      await client.write('home.indoor.temp 21.2 1427727486200\n');

      // Then
      verify(socketMock.write('YOUR-API-KEY.home.indoor.temp 21.2 1427727486200\n', 'utf-8', anyFunction())).called();
    });

    it('writes flattened metrics encoded as utf-8', async () => {
      // Given
      const client = new CarbonClient({ url: 'plaintext://127.0.0.1:2003/' });
      client.socket = socket;

      // When
      await client.write('home.indoor.temp 21.2 1427727486200\n');

      // Then
      verify(socketMock.write('home.indoor.temp 21.2 1427727486200\n', 'utf-8', anyFunction())).called();
    });

    it('rejects when a socket error occur', () => {
      // Given
      when(socketMock.write(anyString(), anyString(), anyFunction())).thenThrow(new Error());
      const client = new CarbonClient({ url: 'plaintext://127.0.0.1:2003/' });
      client.socket = socket;

      // When
      expect(client.write('home.indoor.temp 21.2 1427727486200\n')).rejects.toThrow();
    });
  });
});
