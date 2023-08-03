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
