import { anyString, capture, instance, mock, when } from 'ts-mockito';
import { GraphiteClient } from '../src/graphite';
import { CarbonClient } from '../src/carbon';

describe('GraphiteClient', () => {
  describe('#write', () => {
    it('writes metrics as flat keys with timestamps to CarbonClient', () => {
      // Given
      const carbonClientMock: CarbonClient = mock(CarbonClient);
      const carbonClient = instance(carbonClientMock);
      const client = new GraphiteClient({ url: 'plaintext://127.0.0.1:2003/' });
      client.carbonClient = carbonClient;
      when(carbonClientMock.write(anyString())).thenResolve('');

      // When
      client.write({ home: { indoor: { temp: 21.2 } } }, 1542224824062);

      // Then
      const message = capture(carbonClientMock.write).first();
      expect(message).toEqual(['home.indoor.temp 21.2 1542224824\n']);
    });
  });
  describe('#createClient', () => {
    it('reads url and apiKey', () => {
      const client = new GraphiteClient({
        hostedGraphiteKey: 'YOUR-API-KEY',
        url: 'plaintext://127.0.0.1:2003/',
      });
      expect(client.carbonClient.url).toEqual('plaintext://127.0.0.1:2003/');
      expect(client.carbonClient.hostedGraphiteKey).toEqual('YOUR-API-KEY.');
    });
    it('apiKey is optional and defaults to empty string', () => {
      const client = new GraphiteClient({ url: 'plaintext://127.0.0.1:2003/' });
      expect(client.carbonClient.url).toEqual('plaintext://127.0.0.1:2003/');
      expect(client.carbonClient.hostedGraphiteKey).toEqual('');
    });
  });

  describe('#end', () => {
    it('should be safe to call any time', async () => {
      const client = new GraphiteClient({ url: 'plaintext://127.0.0.1:2003/' });
      expect(await client.end()).toBeUndefined();
    });
  });
});
