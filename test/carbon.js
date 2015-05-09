/*jshint undef:false */
var chaiAsPromised = require('chai-as-promised'),
    chai = require('chai');

chai.should();
chai.use(chaiAsPromised);

describe('CarbonClient', function () {
    var Carbon = require('./../lib/carbon'),
        client,
        socketMock;

    describe('#write', function () {
        beforeEach(function () {
            client = new Carbon({url: 'plaintext://127.0.0.1:2003/'});
            socketMock = {};
            client._socket = socketMock;
        });

        it('writes api key on socket', function (done) {
            var metric = {'home.indoor.temp': 21.2},
                timestamp = 1427727486200;
            socketMock.write = function (lines, encoding, cb) {
                lines.should.equal('YOUR-API-KEY.home.indoor.temp 21.2 1427727486200\n');
                encoding.should.equal('utf-8');
                cb();
            };
            client = new Carbon({hostedGraphiteKey: 'YOUR-API-KEY', url: 'plaintext://127.0.0.1:2003/'});
            client._socket = socketMock;
            client.write(metric, timestamp).should.eventually.equal('home.indoor.temp 21.2 1427727486200\n').notify(done);
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
