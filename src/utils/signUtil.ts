import { Md5 } from "ts-md5";

/**
 * 升序排列，并拼接
 */
function sortParams(params: any, signKey: string) {
  const keyArray = Object.keys(params);
  const newkey = keyArray.sort();
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let str = "";
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < newkey.length; i++) {
    // 遍历newkey数组undefined
    if (params[newkey[i]] !== undefined) {
      if (
        (params[newkey[i]] && params[newkey[i]] instanceof Object) ||
        params[newkey[i]] instanceof Array
      ) {
        const value = JSON.stringify(params[newkey[i]]);
        str += newkey[i] + value;
      } else {
        str += newkey[i] + params[newkey[i]];
      }
    }
  }
  str = signKey + str + signKey;
  return str;
}

function getSign(params: any, signKey: string) {
  const keyArray = Object.keys(params);
  keyArray.forEach((key) => {
    if (
      ((!params[key] && params[key] !== 0) || JSON.stringify(params[key]) === "{}") &&
      params[key] !== false &&
      params[key] !== ""
    ) {
      delete params[key];
    }
  });
  const str = sortParams(params, signKey);
  return Md5.hashStr(str).toLocaleLowerCase();
}

export default {
  getSign
};
