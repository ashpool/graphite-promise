export module Metric {
  export function flatten(obj, flat?: any, prefix?: string) {
    flat = flat || {};
    prefix = prefix || '';

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = obj[key];
        if (typeof value === 'object') {
          this.flatten(value, flat, prefix + key + '.');
        } else {
          flat[prefix + key] = value;
        }
      }
    }
    return flat;
  }
}
