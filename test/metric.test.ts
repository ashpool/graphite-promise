import { Metric } from '../src';

describe('metric', () => {
  describe('#flatten', () => {
    it('flattens objects', () => {
      expect(Metric.flatten({ home: { indoor: { temp: 21.2 } } })).toEqual({ 'home.indoor.temp': 21.2 });
    });
    it('flattens objects two properties', () => {
      expect(Metric.flatten({ home: { indoor: { temp: 21.2, humidity: 94.5 } } })).toEqual({
        'home.indoor.humidity': 94.5,
        'home.indoor.temp': 21.2,
      });
    });
    it('flattens objects three properties', () => {
      expect(Metric.flatten({ foz: { baz: { foo: 42, bar: 1337, soz: 101 } } })).toEqual({
        'foz.baz.bar': 1337,
        'foz.baz.foo': 42,
        'foz.baz.soz': 101,
      });
    });
    it('handles empty objects', () => {
      expect(Metric.flatten({})).toEqual({});
    });
    it('handles shallow objects', () => {
      expect(Metric.flatten({ temp: 27.1 })).toEqual({ temp: 27.1 });
    });
  });
});
