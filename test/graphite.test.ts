import {GraphiteClient} from '../src';
import chaiAsPromised from 'chai-as-promised';
import * as chai from "chai";
import {CarbonClient} from "../src/carbon";
import {anyString, capture, instance, mock, when} from "ts-mockito";

chai.should();
chai.use(chaiAsPromised);

describe('GraphiteClient', () => {
  describe("#write", () => {
    it('writes metrics as flat keys with timestamps to CarbonClient', () => {
      // Given
      const carbonClientMock: CarbonClient = mock(CarbonClient);
      const carbonClient = instance(carbonClientMock);
      const client = new GraphiteClient({url: 'plaintext://127.0.0.1:2003/'});
      client._carbonClient = carbonClient;
      when(carbonClientMock.write(anyString())).thenResolve('');

      // When
      client.write({home: {indoor: {temp: 21.2}}}, 1542224824062);

      // Then
      const message = capture(carbonClientMock.write).first();
      message.should.eql(['home.indoor.temp 21.2 1542224824062\n']);
    });
  });
  describe('#createClient', () => {
    it('reads url and apiKey', () => {
      const client = new GraphiteClient({hostedGraphiteKey: 'YOUR-API-KEY', url: 'plaintext://127.0.0.1:2003/'});
      client._carbonClient._url.should.equal('plaintext://127.0.0.1:2003/');
      client._carbonClient._hostedGraphiteKey.should.equal('YOUR-API-KEY.');
    });
    it('apiKey is optional and defaults to empty string', () => {
      const client = new GraphiteClient({url: 'plaintext://127.0.0.1:2003/'});
      client._carbonClient._url.should.equal('plaintext://127.0.0.1:2003/');
      client._carbonClient._hostedGraphiteKey.should.equal('');
    });
    it('does NOT accept only url as constructor argument', () => {
      // @ts-ignore
      new GraphiteClient('plaintext://127.0.0.1:2003/').should.throw;
    });
  });

  describe('#end', () => {
    it('should be safe to call any time', (done) => {
      const client = new GraphiteClient({url: 'plaintext://127.0.0.1:2003/'});
      client.end().should.be.fulfilled.notify(done);
    });
  });
});
