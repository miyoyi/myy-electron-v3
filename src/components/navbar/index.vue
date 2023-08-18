<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img
          v-if="theme !== 'dark'"
          :style="{
            width: menuWidth,
            minWidth: '160px'
          }"
          alt="logo"
          src="@/assets/images/icon-black.png" />
        <img
          v-else
          :style="{
            width: menuWidth,
            minWidth: '160px'
          }"
          alt="logo"
          src="@/assets/images/icon.png" />
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu" />
      </a-space>
      <div class="left-side__menu">
        <a-menu mode="horizontal" :selected-keys="[headerTabsKey]">
          <a-menu-item
            v-for="item in navBarMenu"
            :key="item.name"
            :title="item.title"
            @click="onChangeTabs(item.name)">
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="theme === 'light' ? '点击切换为暗黑模式' : '点击切换为亮色模式'">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="isFullscreen ? '点击退出全屏模式' : '点击切换全屏模式'">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="'页面配置'">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-button class="nav-btn nav-btn-name" type="outline" shape="round">
            你好，{{ userState.username ? userState.username : "" }}
          </a-button>
          <template #content>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject } from "vue";
  import { useDark, useToggle, useFullscreen } from "@vueuse/core";
  import { useRouter } from "vue-router";
  import { useAppStore, useUserStore } from "@/store";
  import useUser from "@/hooks/user";
  import { UserState } from "@/store/modules/user/types";

  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();

  const { logout } = useUser();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const userState = computed<UserState>(() => {
    return userStore;
  });
  const theme = computed(() => {
    return appStore.theme;
  });
  const menuWidth = computed(() => {
    return `${(appStore.menuCollapse ? 48 : appStore.menuWidth) - 40}px`;
  });
  const navBarMenu = computed(() => {
    return appStore.navBarMenu;
  });
  const headerTabsKey = computed(() => {
    return appStore.headerTabsKey;
  });
  const isDark = useDark({
    selector: "body",
    attribute: "arco-theme",
    valueDark: "dark",
    valueLight: "light",
    storageKey: "arco-theme",
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
    }
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
  };
  const handleLogout = () => {
    logout();
  };
  const toggleDrawerMenu = inject("toggleDrawerMenu") as () => void;
  const onChangeTabs = async (key: string) => {
    await appStore.changeHeaderTabsKey(key);
    await router.push({
      name: appStore.serverMenu[0].children
        ? appStore.serverMenu[0].children[0].name
        : appStore.serverMenu[0].name
    });
  };
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-header-bg);
    border-bottom: 1px solid var(--color-header-border);
  }

  .left-side {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 20px;
    .arco-space .arco-icon {
      color: var(--color-header-text);
    }
    &__menu {
      flex: 1;
      min-width: 200px;
      margin-left: 20px;
      .arco-menu-light {
        background-color: var(--color-aside-bg);
        .arco-menu-item {
          color: var(--color-aside-item-text);
          background-color: var(--color-aside-bg);
          &:hover {
            color: var(--color-aside-selected-text);
            background-color: var(--color-aside-selected-bg);
          }
          :deep(.arco-menu-selected-label) {
            background-color: var(--color-aside-selected-text);
          }
        }
        :deep(.arco-menu-pop-header) {
          color: var(--color-aside-item-text);
          background-color: var(--color-aside-bg);
          &:hover {
            color: var(--color-aside-selected-text);
            background-color: var(--color-aside-selected-bg);
          }
        }
      }
    }
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }
    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
    .nav-btn {
      border-color: var(--color-header-border-text);
      color: var(--color-header-text);
      font-size: 14px;
    }
    .nav-btn-name {
      border: 0;
    }
    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }
    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
