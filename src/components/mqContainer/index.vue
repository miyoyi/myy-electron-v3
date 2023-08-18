<template>
  <div class="container">
    <a-card class="container-card">
      <slot></slot>
    </a-card>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .container {
    position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    .container-card {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      & > .arco-card-header {
        height: auto;
        padding: 20px;
        border: none;
      }
      :deep(.arco-card-body) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
