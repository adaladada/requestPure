import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { message } from "@/utils/message";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    // 页面级别权限
    roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(uploadData) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(uploadData)
          .then(data => {
            if (data.code == "00000") {
              if (data) {
                const fakeData = {
                  code: "00000",
                  msg: "成功",
                  success: true,
                  data: {
                    username: uploadData.username,
                    roles: ["admin"],
                    accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
                    refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
                    expires: new Date(Date.now() + 365 * 24 * 60 * 60000)
                  }
                };
                message("登录成功", { type: "success" });
                setToken(fakeData.data);
                resolve(fakeData);
              }
            } else if (data.code === "A0100") {
              message(data.msg, { type: "error" });
              reject(data.msg);
            } else {
              message(data.msg, { type: "error" });
              reject(data.msg);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
