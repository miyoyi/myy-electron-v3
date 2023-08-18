<template>
  <div v-if="model === 'advance'" v-permission="permissionQuery" class="advance-query-form">
    <slot name="form"></slot>
  </div>
  <a-divider v-if="model === 'advance'" v-permission="permissionQuery" style="margin-top: 0" />
  <div class="advance-query-btn">
    <div class="advance-query-btn__left">
      <a-button
        v-if="!$slots.left && isShowCreateBtn"
        v-permission="permissionCreate"
        type="primary"
        size="small"
        @click="onCreate"
        >{{ createBtnText }}</a-button
      >
      <slot name="left"></slot>
    </div>
    <div class="advance-query-btn__right">
      <a-space fill>
        <div v-permission="permissionQuery" class="advance-query-btn-form">
          <slot v-if="model === 'ordinary'" name="form"></slot>
        </div>
        <a-button v-permission="permissionQuery" type="primary" @click="onQuery">查询</a-button>
        <a-button v-permission="permissionQuery" @click="onResetQuery">重置</a-button>
        <slot name="right"></slot>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  /**
   * mq-advance-query 查询模组
   * @description mq-advance-query。
   * @property {Boolean} isShowCreateBtn 是否显示左侧按钮
   * @property {String} createBtnText 左侧按钮文案
   * @property {String} model 展示模式 ordinary(普通模式 少量查询条件1-3个) advance(高级模式)
   * @example <mq-advance-query  model="advance"@query="onQuery" @reset-query="onResetQuery"></mq-advance-query>
   */

  interface Props {
    isShowCreateBtn?: boolean;
    createBtnText?: string;
    model: string;
    permissionCreate?: any;
    permissionQuery?: any;
  }
  withDefaults(defineProps<Props>(), {
    isShowCreateBtn: true,
    createBtnText: "新建",
    model: "ordinary"
  });
  const emit = defineEmits<{
    (e: "create", item: any): void;
    (e: "query", item: any): void;
    (e: "resetQuery", item: any): void;
  }>();

  const onCreate = (item: any) => {
    emit("create", item);
  };
  const onQuery = (item: any) => {
    emit("query", item);
  };
  const onResetQuery = (item: any) => {
    emit("resetQuery", item);
  };
</script>

<style lang="less" scoped>
  .advance-query-btn {
    display: flex;
    align-content: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 16px;
    &__right {
      flex: 1;
      display: flex;
      justify-content: end;
      .advance-query-btn-form {
        margin: 0 20px;
        :deep(.arco-row) {
          margin: 0;
        }
      }
    }
  }
  :deep(.arco-picker) {
    width: 100%;
  }
</style>
