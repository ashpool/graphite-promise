/*jshint undef:false */
var chaiAsPromised = require('chai-as-promised'),
  chai = require('chai'),
  metric = require('./../lib/metric');

chai.should();
chai.use(chaiAsPromised);

describe('metric', function () {
  describe('#flatten', function () {
    it('flattens objects', function () {
      metric.flatten({home: {indoor: {temp: 21.2}}}).should.deep.equal({'home.indoor.temp': 21.2});
    });
    it('flattens objects two properties', function () {
      metric.flatten({home: {indoor: {temp: 21.2, humidity: 94.5}}})
        .should.deep.equal({'home.indoor.humidity': 94.5, 'home.indoor.temp': 21.2});
    });
    it('flattens objects three properties', function () {
      metric.flatten({foz: {baz: {foo: 42, bar: 1337, soz: 101}}})
        .should.deep.equal({'foz.baz.bar': 1337, 'foz.baz.foo': 42, 'foz.baz.soz': 101});
    });
    it('handles empty objects', function () {
      metric.flatten({}).should.deep.equal({});
    });
    it('handles shallow objects', function () {
      metric.flatten({temp: 27.1}).should.deep.equal({temp: 27.1});
    });
  });
});
