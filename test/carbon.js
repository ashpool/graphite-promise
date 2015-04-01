/*jshint undef:false */
var chaiAsPromised = require('chai-as-promised'),
    chai = require('chai');

chai.should();
chai.use(chaiAsPromised);

describe('CarbonClient', function () {
    var Carbon = require('./../lib/carbon'),
        client = new Carbon({dsn: 'plaintext://127.0.0.1:2003/'}),
        socketMock = {};

    describe('#write', function () {
        before(function () {
            client._socket = socketMock;
        });

        it('writes flattened metrics encoded as utf-8', function (done) {
            var metric = {'home.indoor.temp': 21.2},
                timestamp = 1427727486200;
            socketMock.write = function (lines, encoding, cb) {
                lines.should.equal('home.indoor.temp 21.2 1427727486200\n');
                encoding.should.equal('utf-8');
                cb();
            };
            client.write(metric, timestamp).should.eventually.equal('home.indoor.temp 21.2 1427727486200\n').notify(done);
        });
        it('rejects when a socket error occur', function (done) {
            var metric = {'home.indoor.temp': 21.2},
                timestamp = 1427727486200;
            socketMock.write = function (lines, encoding, cb) {
                cb(new Error('fail'));
            };
            client.write(metric, timestamp).should.eventually.be.rejected.notify(done);
        });
    });
});
