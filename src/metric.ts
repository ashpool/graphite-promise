module Metric {
  export const flatten = (obj: Record<string, any>, flat: Record<string, number> = {}, prefix: string = '') => {
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          flatten(value, flat, `${prefix}${key}.`);
        } else {
          flat[prefix + key] = value;
        }
      }
    }
    return flat;
  }
}

export default Metric;
