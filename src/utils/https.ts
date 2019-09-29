import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Message } from "element-ui";

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

// 创建 axios 实例
let service: AxiosInstance | any;
if (process.env.NODE_ENV === "development") {
  service = axios.create({
    baseURL: "/api", // api 的 base_url
    timeout: 50000 // 请求超时时间
  });
} else {
  // 生产环境下
  service = axios.create({
    baseURL: "/api",
    timeout: 50000
  });
}

// request 拦截器 axios 的一些配置
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error("error:", error); // for debug
    Promise.reject(error);
  }
);

// respone 拦截器 axios 的一些配置
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // Some example codes here:
    // code == 0: success
    if (res.status === 200) {
      const data: ResponseData = res.data
      if (data.code === 0) {
        return data.data;
      } else {
        Message({
          message: data.message,
          type: "error"
        });
      }
    } else {
      Message({
        message: "网络错误!",
        type: "error"
      });
      return Promise.reject(new Error(res.data.message || "Error"));
    }
  },
  (error: any) => Promise.reject(error)
);

export default service;
