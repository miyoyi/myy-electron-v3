<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transverse" mode="out-in">
      <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { useTabBarStore } from "@/store";

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
  .fade-transverse-leave-active,
  .fade-transverse-enter-active {
    transition: all 0.2s;
  }
  .fade-transverse-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }
  .fade-transverse-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
