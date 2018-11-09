export module Metric {
  export function flatten(obj: Record<string, number>, flat: Record<string, number> = {}, prefix: string = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          flatten(value, flat, prefix + key + '.');
        } else {
          flat[prefix + key] = value;
        }
      }
    }
    return flat;
  }
}
