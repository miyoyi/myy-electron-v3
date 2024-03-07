<template>
  <div id="appNav" class="drag" :style="{ justifyContent: prog ? 'space-between' : 'flex-end' }">
    <div v-if="prog" class="appNav_left">{{ data.progress }}%</div>
    <div class="no-drag appNav_right">
      <div
        v-for="item in control"
        :key="item.key"
        :class="['controlButton', item.key]"
        :style="{ color: appStore.theme === 'dark' ? '#eee' : '#111' }"
        @click="controlButtonClick(item.key)">
        <AppIcon :class="item.key" :type="item.icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="AppNav">
  import { reactive, computed, onMounted } from "vue";
  import { useAppStore } from "@/store";
  import AppIcon from "@/utils/aliicons";

  const appStore = useAppStore();

  const data = reactive({
    progress: 0
  });

  const control = [
    { key: "mini", icon: "icon-2zuixiaohua-2" },
    { key: "big", icon: "icon-zuidahua1" },
    { key: "close", icon: "icon-close-bold" }
  ];

  const prog = computed(() => {
    return data.progress && data.progress !== 100;
  });

  // 在组件挂载时监听事件
  onMounted(() => {
    window.ipc.on("download-progress", (progress: any) => {
      data.progress = progress * 100;
    });
  });

  const controlButtonClick = (val: string) => {
    window.ipc.send("navBar", val);
  };
</script>

<style lang="less" scoped>
  .drag {
    width: 100vw;
    height: var(--nav-height);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    z-index: 999;
    .appNav_left,
    .appNav_right {
      height: 100%;
    }
    .appNav_left {
      margin: 1vw 0 0 2vw;
      font-size: large;
      font-weight: bolder;
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
