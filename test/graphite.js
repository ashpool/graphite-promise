/*jshint undef:false */
var chaiAsPromised = require('chai-as-promised'),
  chai = require('chai');

chai.should();
chai.use(chaiAsPromised);

describe('GraphiteClient', function() {
  describe('#createClient', function() {
    it('reads url and apiKey', function() {
      var graphite = require('./../lib/graphite'),
        client = graphite.createClient({ apiKey: 'YOUR-API-KEY.foo 1.2\n', url: 'plaintext://127.0.0.1:2003/' });
      client._carbon._url.should.equal('plaintext://127.0.0.1:2003/');
      client._carbon._apiKey.should.equal('YOUR-API-KEY.foo 1.2\n');
    });
    it('apiKey is optional and defaults to empty string', function() {
      var graphite = require('./../lib/graphite'),
        client = graphite.createClient({ url: 'plaintext://127.0.0.1:2003/' });
      client._carbon._url.should.equal('plaintext://127.0.0.1:2003/');
      client._carbon._apiKey.should.equal('');
    });
    it('is ok to use only url as argument', function() {
      var graphite = require('./../lib/graphite'),
        client = graphite.createClient('plaintext://127.0.0.1:2003/');
      client._carbon._url.should.equal('plaintext://127.0.0.1:2003/');
      client._carbon._apiKey.should.equal('');
    });
  });

  describe('#end', function() {
    it('should be safe to call any time', function(done) {
      var graphite = require('./../lib/graphite'),
        client = graphite.createClient({ url: 'plaintext://127.0.0.1:2003/' });
      client.end().should.be.fulfilled.notify(done);
    });
  });
});
