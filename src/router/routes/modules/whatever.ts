import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const DASHBOARD: AppRouteRecordRaw = {
  path: "/whateverTop",
  name: "whateverTop",
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    icon: "icon-dashboard",
    order: 0
  },
  children: [
    {
      path: "whateverFirst",
      name: "whateverFirst",
      component: undefined,
      redirect: "notFound",
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "whateverSecond",
          name: "whateverSecond",
          component: () => import("@/views/whatever/whatever/index.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "whateverAnother",
          name: "whateverAnother",
          component: () => import("@/views/whatever/whateverAnother/index.vue"),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: "whatever",
      name: "whatever",
      component: () => import("@/views/whatever/index.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ]
};

export default DASHBOARD;
