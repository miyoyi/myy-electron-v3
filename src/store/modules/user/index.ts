import { defineStore } from "pinia";
import { login as userLogin, LoginData } from "@/api/modules/accountApi";
import { setToken, clearToken } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import { UserState } from "./types";
import useAppStore from "../app";

const useUserStore = defineStore("user", {
  persist: true,
  state: (): UserState => ({
    // clientId: '',
    // clientName: '',
    // clientSecret: '',
    // expire: '',
    // memberType: '',
    // token: '',
    // info: {},
    channelId: undefined,
    clientSecret: "",
    id: undefined,
    isDeleted: undefined,
    isLeader: undefined,
    mobile: "",
    name: "",
    postGroupId: undefined,
    status: undefined,
    token: "",
    username: ""
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        this.setInfo(res.data);
        setToken(res.data.token || "");
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
    }
  }
});

export default useUserStore;
