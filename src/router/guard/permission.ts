import type { Router, RouteRecordNormalized } from "vue-router";
import NProgress from "nprogress"; // progress bar

import usePermission from "@/hooks/permission";
import { useAppStore } from "@/store";
import { WHITE_LIST, NOT_FOUND } from "../constants";

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (appStore.menuFromServer) {
      if (!appStore.appAsyncMenus.length && !WHITE_LIST.find((el) => el.name === to.name)) {
        await appStore.resetRouter(router);
      }
      let toName = to.name;
      if (toName === undefined) {
        const pathArr = to.path.split("/");
        toName = pathArr[pathArr.length - 1];
      }
      const serverMenuConfig = [...appStore.apiMenuList, ...WHITE_LIST];
      let exist = false;
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        if (element?.name === toName) exist = true;

        if (element?.children) {
          serverMenuConfig.push(...(element.children as unknown as RouteRecordNormalized[]));
        }
      }
      if (exist && permissionsAllow) {
        if (to.name === undefined) {
          to.name = toName;
          next(to);
        } else {
          next();
        }
      } else next(NOT_FOUND);
    } else {
      next();
    }
    NProgress.done();
  });
  router.afterEach(async (to, from) => {
    const appStore = useAppStore();
    // 根据路由信息切换导航栏信息
    if (
      !WHITE_LIST.find((el) => el.name === to.name) &&
      to.path.split("/")[1] !== from.path.split("/")[1]
    ) {
      await appStore.changeHeaderTabsKey(to.path.split("/")[1]);
    }
  });
}
