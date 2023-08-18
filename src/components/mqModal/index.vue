<template>
  <a-modal
    ref="modalRef"
    v-bind="$attrs"
    v-model:visible="visible"
    title-align="start"
    modal-class="mq-modal"
    :modal-style="modalStyle"
    @cancel="onCancel"
    @close="onClose">
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
      <a-button v-if="isShowCancel" @click="onCancel">
        {{ cancelText }}
      </a-button>
      <a-button v-if="isShowOk" type="primary" :loading="okLoading" @click="onOk">
        {{ okText }}
      </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  /**
   * mq-modal 选择器
   * @description mq-select 选择器 在a-select的基础上进行扩展 可使用a-select的全部属性，参数，插槽，方法。
   * @tutorial https://arco.design/vue/component/modal
   * @property {String, Number, Boolean} v-model 布尔值变量，用于控制弹出与收起
   * @property {Boolean} isHideModel 是否点击内置按钮时关闭弹窗(默认true)
   * @property {Boolean} isShowOk 是否显示确认按钮(默认true)
   * @property {Boolean} isShowCancel 是否显示取消按钮(默认true)
   * @property {String} okText 取消确认文案(默认确认)
   * @property {String} cancelText 取消按钮文案(默认取消)
   * @example <mq-modal v-model="value"></mq-modal>
   */
  import { watch, ref, CSSProperties } from "vue";

  interface Props {
    modelValue?: boolean;
    isShowOk?: boolean;
    isShowCancel?: boolean;
    isHideModel?: boolean;
    okLoading?: boolean;
    okText?: string;
    cancelText?: string;
    modalStyle?: CSSProperties;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    okLoading: false,
    isHideModel: true,
    isShowOk: true,
    isShowCancel: true,
    modalStyle: () => {
      return {
        width: "80%",
        height: "80%"
      };
    },
    okText: "确认",
    cancelText: "取消"
  });
  const emits = defineEmits(["update:modelValue", "cancel", "ok"]);
  const visible = ref(props.modelValue);
  const modalRef = ref();
  watch(
    () => props.modelValue,
    (val) => {
      visible.value = val;
    }
  );
  const onCancel = () => {
    if (props.isHideModel) visible.value = false;
    emits("cancel");
  };
  const onOk = () => {
    modalRef.value.handleOk();
  };
  const onClose = () => {
    emits("update:modelValue", false);
  };
</script>

<style lang="less">
  .mq-modal {
    display: inline-flex !important;
    justify-content: center;
    flex-flow: column;
    .arco-modal-body {
      flex: 1;
    }
    .arco-page-header-title {
      font-size: 18px;
    }
  }
</style>
