<template>
  <div id="app">
    <Nav />
    <a-config-provider>
      <router-view />
      <global-setting />
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
  import GlobalSetting from "@/components/global-setting/index.vue";
  import Nav from "@/components/nav/index.vue";
</script>

<style lang="less" scoped>
  #app {
    --nav-height: 28px;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    position: relative;
  }
</style>
