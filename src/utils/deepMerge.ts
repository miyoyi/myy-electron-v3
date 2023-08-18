import deepClone from "./deepClone";

interface objData {
  [key: string]: any;
}
// JS对象深度合并
function deepMerge(target: objData = {}, source: objData = {}): any {
  target = deepClone(target);
  if (typeof target !== "object" || typeof source !== "object") return {};
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in source) {
    // eslint-disable-next-line no-prototype-builtins,no-continue
    if (!source.hasOwnProperty(prop)) continue;
    if (prop in target) {
      if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== "object") {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = deepMerge(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

export default deepMerge;
