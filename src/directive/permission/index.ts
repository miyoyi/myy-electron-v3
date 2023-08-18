import { DirectiveBinding } from "vue";
import type { RouteRecordNormalized } from "vue-router";
import router from "@/router";

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  if (Object.prototype.toString.call(value) === "[object Object]") {
    let routes: RouteRecordNormalized[] = router.getRoutes();
    routes = routes.filter((item: RouteRecordNormalized) => {
      return item.name === value.name;
    });
    if (routes.length !== 0) {
      const buttons: any = routes[0]?.meta?.buttons;
      const hasPermission = buttons.includes(value.code);
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  }
};
