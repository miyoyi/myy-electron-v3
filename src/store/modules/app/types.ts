import type { RouteRecordNormalized } from "vue-router";

export interface NavBarMenu {
  path: string;
  name: string;
  title: string;
  order: number;
}

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  headerTabsKey: string;
  tabBar: boolean;
  menuFromServer: boolean;
  navBarMenu: NavBarMenu[];
  // 实际展示的侧边栏菜单
  serverMenu: RouteRecordNormalized[];
  // 菜单对象列表方便直接提取
  apiMenuObj: {
    [key: string]: any;
  };
  // 权限菜单扁平化 用于过滤权限
  apiMenuList: RouteRecordNormalized[];
  // 后台获取的菜单元数据
  permitMenuList: {
    [key: string]: any;
  };
  [key: string]: unknown;
}
