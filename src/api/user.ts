import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type UserResult = {
  code: string;
  msg: string;
  data: {};
};

export type AppResult = {
  code: string;
  msg: string;
  data: {
    appid: string;
  };
};

export type UserAndApp = {
  code: string;
  msg: string;
  data: {
    status: boolean;
  };
};

export type IdSet = {
  code: string;
  msg: string;
  data: {
    idArray: [
      {
        appid: string;
        appName: string;
        userid: [];
      }
    ];
  };
};

export type Log = {
  code: string;
  msg: string;
  data: {
    logs: [
      {
        appid: string;
        userid: string;
        type: number;
        timestamp: number;
        msg: string;
      }
    ];
    total: number;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("login"), { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

/** appid申请 */
export const getAppid = (data?: object) => {
  return http.request<AppResult>("post", baseUrlApi("getAppid"), { data });
};

/** 用户主动上报 */
export const reportAppUser = (data?: object) => {
  return http.request<UserAndApp>("post", baseUrlApi("report"), { data });
};

/** 下发appid和userid */
export const getIdSet = (data?: object) => {
  return http.request<IdSet>("get", baseUrlApi("idSet"), { data });
};

/** 日志查询 */
export const sendLogs = (data?: object) => {
  return http.request<Log>("get", baseUrlApi("sendLog"), { data });
};
