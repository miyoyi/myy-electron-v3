// import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { Message, Modal } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import { getToken } from "@/utils/auth";
import signUtil from "@/utils/signUtil";
import deepClone from "@/utils/deepClone";

export interface HttpResponse<T = unknown> {
  ret: boolean;
  result: T;
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: any) => {
    const t = (new Date().getTime() / 1000).toFixed(0);
    const params = deepClone(config.method === "get" ? config.params : config.data);
    const keyArray = Object.keys(params);
    keyArray.forEach((key) => {
      if (
        (!params[key] && params[key] !== 0) ||
        (Array.isArray(params[key]) && params[key].length === 0) ||
        (JSON.stringify(params[key]) === "{}" && !(params[key] instanceof File))
      ) {
        delete params[key];
      }
    });
    if (params.hasOwnProperty.call("sign")) delete params.sign; // 去除逻辑中key为sign的参数
    params.t = t;
    // 时间戳加进去签名
    const userStore = useUserStore();
    const appKey = userStore?.clientSecret || "";
    // 签名完再添加到参数中去
    params.sign = signUtil.getSign(params, appKey);
    if (config.method === "get") {
      config.params = params;
    } else {
      config.data = params;
    }
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    if (res.ret) {
      return {
        ...response,
        data: res.result
      };
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message.error({
        content: res.msg || "Error",
        duration: 5 * 1000
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if ([50008, 50012, 50014].includes(res.code) && response.config.url !== "/api/user/info") {
        Modal.error({
          title: "Confirm logout",
          content: "You have been logged out, you can cancel to stay on this page, or log in again",
          okText: "Re-Login",
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          }
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || "Request Error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default axios;
