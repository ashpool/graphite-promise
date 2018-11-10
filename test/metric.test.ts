import *  as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import {Metric} from '../src/metric';

chai.should();
chai.use(chaiAsPromised);

describe('metric', () => {
  describe('#flatten', () => {
    it('flattens objects', () => {
      Metric.flatten({home: {indoor: {temp: 21.2}}}).should.deep.equal({'home.indoor.temp': 21.2});
    });
    it('flattens objects two properties', () => {
      Metric.flatten({home: {indoor: {temp: 21.2, humidity: 94.5}}})
        .should.deep.equal({'home.indoor.humidity': 94.5, 'home.indoor.temp': 21.2});
    });
    it('flattens objects three properties', () => {
      Metric.flatten({foz: {baz: {foo: 42, bar: 1337, soz: 101}}})
        .should.deep.equal({'foz.baz.bar': 1337, 'foz.baz.foo': 42, 'foz.baz.soz': 101});
    });
    it('handles empty objects', () => {
      Metric.flatten({}).should.deep.equal({});
    });
    it('handles shallow objects', () => {
      Metric.flatten({temp: 27.1}).should.deep.equal({temp: 27.1});
    });
  });
});
