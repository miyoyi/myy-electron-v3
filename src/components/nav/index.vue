<script setup lang="ts" name="AppNav">
  import AppIcon from "@/utils/aliicons";

  const control = [
    { key: "mini", icon: "icon-2zuixiaohua-2" },
    { key: "big", icon: "icon-zuidahua1" },
    { key: "close", icon: "icon-close-bold" }
  ];

  const controlButtonClick = (val: string) => {
    window.ipc.send("navBar", val);
  };
</script>

<template>
  <div id="appNav" class="drag">
    <div class="no-drag appNav_right">
      <div
        v-for="item in control"
        :key="item.key"
        :class="['controlButton', item.key]"
        @click="controlButtonClick(item.key)">
        <AppIcon :class="item.key" :type="item.icon" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  #appNav {
    width: 100vw;
    height: var(--nav-height);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 999;
    .appNav_left,
    .appNav_right {
      height: 100%;
    }
    .appNav_right {
      .controlButton {
        text-align: center;
        line-height: var(--nav-height);
        height: var(--nav-height);
        width: 36px;
        display: inline-block;
      }
      .mini:hover {
        background-color: azure;
      }
      .big:hover {
        background-color: azure;
      }
      .close:hover {
        background-color: red;
      }
    }
  }
  /* 可拖动 */
  .drag {
    -webkit-app-region: drag;
  }

  /* 不可拖动 */
  .no-drag {
    -webkit-app-region: no-drag;
  }
</style>
