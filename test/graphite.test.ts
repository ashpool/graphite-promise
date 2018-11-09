import {GraphiteClient} from '../src/graphite';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from "chai";

chai.should();
chai.use(chaiAsPromised);

describe('GraphiteClient', () => {
  describe('#createClient', () => {
    it('reads url and apiKey', () => {
      const client = new GraphiteClient({hostedGraphiteKey: 'YOUR-API-KEY', url: 'plaintext://127.0.0.1:2003/'});
      client.carbonClient._url.should.equal('plaintext://127.0.0.1:2003/');
      client.carbonClient._hostedGraphiteKey.should.equal('YOUR-API-KEY.');
    });
    it('apiKey is optional and defaults to empty string', () => {
      const client = new GraphiteClient({url: 'plaintext://127.0.0.1:2003/'});
      client.carbonClient._url.should.equal('plaintext://127.0.0.1:2003/');
      client.carbonClient._hostedGraphiteKey.should.equal('');
    });
    it('does NOT accept only url as constructor argument', () => {
      const client = new GraphiteClient('plaintext://127.0.0.1:2003/').should.throw;
    });
  });

  describe('#end', () => {
    it('should be safe to call any time', (done) => {
      const client = new GraphiteClient({url: 'plaintext://127.0.0.1:2003/'});
      client.end().should.be.fulfilled.notify(done);
    });
  });
});
