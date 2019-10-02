module Metric {
  export function flatten(obj: Record<string, any>, flat: Record<string, number> = {}, prefix: string = ''): Record<string, number> { // eslint-disable-line no-inner-declarations
    for (const key in obj) { // eslint-disable-line no-restricted-syntax
      if ({}.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          flatten(value, flat, `${prefix}${key}.`);
        } else {
          flat[prefix + key] = value; // eslint-disable-line  no-param-reassign
        }
      }
    }
    return flat;
  }
}

export default Metric;
