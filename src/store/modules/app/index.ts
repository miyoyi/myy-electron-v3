import { defineStore } from "pinia";
import { Notification } from "@arco-design/web-vue";
import type { NotificationReturn } from "@arco-design/web-vue/es/notification/interface";
import type { Router, RouteRecordNormalized } from "vue-router";
import defaultSettings from "@/config/settings.json";
import { getMenuList } from "@/api/modules/accountApi";
import { appRoutes } from "@/router/routes";
import deepMerge from "@/utils/deepMerge";
import { AppState, NavBarMenu } from "./types";

function getNavBarMenu(data: any): NavBarMenu[] {
  const menu = data.map((item: any) => {
    return {
      path: item.path,
      name: item.name,
      title: item.meta.title,
      order: item.meta.order
    };
  });
  return menu.sort((a: any, b: any) => a.order - b.order);
}

function filterRouter(
  routerList: RouteRecordNormalized[],
  permitMenuList: any
): RouteRecordNormalized[] {
  return routerList.filter((route: any) => {
    for (let i = 0; i < permitMenuList.length; i += 1) {
      if (route.name === permitMenuList[i].code) {
        route.meta.title = permitMenuList[i].name;
        route.meta.icon = permitMenuList[i].icon || "icon-dashboard";
        route.meta.order = i;

        // 添加按钮组
        if (permitMenuList[i].buttons) {
          route.meta.buttons = permitMenuList[i].buttons.reduce((prev: any, cur: any) => {
            prev.push(cur.code);
            return prev;
          }, []);
        }
        if (route.children && route.children.length) {
          route.children = filterRouter(route.children, permitMenuList[i].children);
        }
        return true;
      }
    }
    return false;
  });
}
const useAppStore = defineStore("app", {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    }
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = "dark";
        document.body.setAttribute("arco-theme", "dark");
      } else {
        this.theme = "light";
        document.body.removeAttribute("arco-theme");
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    clearServerMenu() {
      this.serverMenu = [];
      this.permitMenuList = [];
      this.apiMenuObj = {};
      this.apiMenuList = [];
    },
    // 重置路由权限
    async resetRouter(router: Router) {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: "menuNotice", // Keep the instance id the same
          content: "正在加载菜单配置",
          closable: true
        });
        // 异步获取菜单权限
        if (this.permitMenuList.length === 0) {
          const res: any = await getMenuList();
          this.permitMenuList = res.data.children;
        }
        // 过滤菜单权限
        const routerList = filterRouter(deepMerge(appRoutes), this.permitMenuList);
        this.apiMenuObj = {};
        // 提取顶部菜单信息
        this.navBarMenu = getNavBarMenu(routerList);

        // 添加权限路由
        routerList.forEach((route) => {
          this.apiMenuObj[route.name as string] = route.children;
          router.addRoute(route);
        });

        // 菜单扁平化处理
        Object.keys(this.apiMenuObj).forEach((key) => {
          this.apiMenuObj[key].forEach((item: any) => {
            this.apiMenuList.push(item);
          });
        });

        // 初始化菜单信息
        this.serverMenu = this.apiMenuObj[this.navBarMenu[0].name];
        notifyInstance = Notification.success({
          id: "menuNotice",
          content: "菜单加载成功",
          closable: true
        });
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: "menuNotice",
          content: "菜单加载失败",
          closable: true
        });
      }
    },
    async changeHeaderTabsKey(path: string) {
      this.serverMenu = this.apiMenuObj[path];
      this.headerTabsKey = path;
    }
  }
});

export default useAppStore;
