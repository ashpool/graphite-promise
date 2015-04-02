/*jshint undef:false */
var chaiAsPromised = require('chai-as-promised'),
    chai = require('chai');

chai.should();
chai.use(chaiAsPromised);

describe('GraphiteClient', function () {
    describe('#end', function () {
        it('should be safe to call any time', function (done) {
            var graphite = require('./../lib/graphite'),
                client = graphite.createClient('plaintext://127.0.0.1:2003/');
            client.end().should.be.fulfilled.notify(done);
        });
    });
});
