import Mock from "mockjs";
import setupMock, { successResponseWrap, failResponseWrap } from "@/utils/setup-mock";

import { MockParams } from "@/types/mock";
import { isLogin } from "@/utils/auth";

setupMock({
  mock: true,
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp("/api/user/info"), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem("userRole") || "admin";
        return successResponseWrap({
          name: "王立群",
          avatar:
            "//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png",
          email: "wangliqun@email.com",
          job: "frontend",
          jobName: "前端艺术家",
          organization: "Frontend",
          organizationName: "前端",
          location: "beijing",
          locationName: "北京",
          introduction: "人潇洒，性温存",
          personalWebsite: "https://www.arco.design",
          phone: "150****0000",
          registrationDate: "2013-05-10 12:10:00",
          accountId: "15012312300",
          certification: 1,
          role
        });
      }
      return failResponseWrap(null, "未登录", 50008);
    });

    // 登录
    Mock.mock(new RegExp("/api/user/login"), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body);
      if (!username) {
        return failResponseWrap(null, "用户名不能为空", 50000);
      }
      if (!password) {
        return failResponseWrap(null, "密码不能为空", 50000);
      }
      if (username === "admin" && password === "admin") {
        window.localStorage.setItem("userRole", "admin");
        return successResponseWrap({
          id: 1,
          username: "miyoyi",
          token: "12345"
        });
      }
      if (username === "user" && password === "user") {
        window.localStorage.setItem("userRole", "user");
        return successResponseWrap({
          token: "54321"
        });
      }
      return failResponseWrap(null, "账号或者密码错误", 50000);
    });

    // 登出
    Mock.mock(new RegExp("/api/user/logout"), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp("/api/account/menu/getPermitMenu"), () => {
      const result = {
        children: [
          {
            children: [
              {
                children: [
                  {
                    buttons: [],
                    code: "whateverSecond",
                    id: 52,
                    name: "一级路由下的二级路由",
                    parentId: 51,
                    priority: 1,
                    type: 1
                  },
                  {
                    buttons: [],
                    code: "whateverAnother",
                    id: 53,
                    name: "第二个二级",
                    parentId: 52,
                    priority: 1,
                    type: 1
                  }
                ],
                code: "whateverFirst",
                id: 51,
                name: "设置的侧边栏一级路由",
                parentId: 50,
                priority: 1,
                type: 1
              },
              {
                code: "whatever",
                id: 54,
                name: "设置的侧边栏一级路由",
                parentId: 53,
                priority: 1,
                type: 1
              }
            ],
            code: "whateverTop",
            id: 50,
            name: "设置的导航栏路由",
            parentId: 1,
            priority: 2,
            type: 1
          }
        ],
        id: 1,
        name: "",
        parentId: 0,
        priority: 1,
        type: 1,

        ret: true
      };
      return successResponseWrap(result);
    });
  }
});
