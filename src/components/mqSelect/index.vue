<template>
  <a-select
    v-model="value"
    v-bind="$attrs"
    :loading="data.loading"
    :placeholder="placeholder"
    :allow-clear="clearable"
    :filter-option="filterOption"
    :allow-search="allowSearch"
    @search="onSearch"
    @dropdown-reach-bottom="loadList"
    @popup-visible-change="onVisibleChange"
    @change="onChange"
    @remove="onReset">
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty"></slot>
    </template>
    <a-option
      v-for="(item, index) in data.dataList"
      :key="index"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :disabled="item[disabledKey]"></a-option>
    <a-option v-if="getApi" :label="data.bottomText" :value="data.bottomText" :disabled="true" />
  </a-select>
</template>

<script lang="ts" setup>
  /**
   * mq-select 选择器
   * @description mq-select 选择器 在a-select的基础上进行扩展 可使用a-select的全部属性，参数，插槽，方法。
   * @tutorial https://arco.design/vue/component/select
   * @property {String, Number, Boolean} v-model 布尔值变量，用于控制日历的弹出与收起
   * @property {Object} params 自定义请求参数
   * @property {String} initRemoteKey 初始化时回显的查询key
   * @property {Array} optionList 自定义option列表如果getApi则以getApi为准
   * @property {Object} initOption 自定义初始化回显option会与dataList过滤
   * @property {Function} getApi 自定义请求接口
   * @property {Function} remoteMethod 远程搜索方法 remote为ture时必传
   * @property {Boolean} clearable 是否可以清空选项(默认true)
   * @property {String} labelKey 自定义labelKey(默认label)
   * @property {String} valueKey 自定义valueKey(默认value)
   * @property {String} disabledKey 自定义disabledKey(默认disabled)
   * @property {Number} pageNum 页码(默认0)
   * @property {Number} pageSize 页码(默认20)
   * @property {Boolean} isInitLoad 是否在组件加载时初始化接口数据(默认false)
   * @property {Boolean} automaticDropdown 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单(默认true)
   * @example <mq-select v-model="value" :getApi="getApi" :remoteMethod="remoteMethod"></u-calendar>
   */
  import { reactive, computed, watch } from "vue";
  import { isEqual } from "lodash";

  interface Props {
    labelKey?: string;
    valueKey?: string;
    disabledKey?: string;
    placeholder?: string;
    modelValue: string | number;
    clearable?: boolean;
    isInitLoad?: boolean;
    getApi?(params: object): any;
    remoteMethod?(params: object): any;
    params?: object;
    pageNum?: number;
    pageSize?: number;
    initRemoteKey?: string;
    allowSearch?: boolean;
    filterOption?: boolean;
    optionList?: any;
    initOption?: {
      [key: string]: any;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    labelKey: "label",
    valueKey: "value",
    disabledKey: "disabled",
    placeholder: "placeholder",
    modelValue: "",
    clearable: true,
    isInitLoad: false,
    allowSearch: true,
    filterOption: false,
    pageNum: 0,
    pageSize: 20,
    params: () => {
      return {};
    },
    initOption: () => {
      return {};
    }
  });
  const emits = defineEmits(["update:modelValue", "change", "visibleChange"]);
  const data: {
    loading: boolean;
    isInitPage: boolean;
    dataList: any[];
    bottomText: string;
    newInitOption: any;
    remoteParams: any;
    page: {
      total: number;
      num: number;
      size: number;
    };
  } = reactive({
    loading: false,
    isInitPage: true,
    bottomText: "加载中...",
    dataList: [],
    newInitOption: {},
    remoteParams: {},
    page: {
      total: 0,
      num: 0,
      size: 10
    }
  });
  const value = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits("update:modelValue", val);
    }
  });

  const getParams = (query: object) => {
    data.page.num += 1;
    return {
      page: data.page.num,
      pageSize: data.page.size,
      ...query
    };
  };
  const loadList = async () => {
    if (!props.getApi || (data.page.total && data.dataList.length >= data.page.total)) return;

    const params = getParams(props.params);
    try {
      const res = await props.getApi({ ...params, ...data.remoteParams });
      const apiData = res.data;
      // 接口返回的当前页数据列表 (数组)
      const curPageData = apiData.data || apiData;
      // 设置列表数据
      if (data.page.num === 1) {
        data.dataList = []; // 如果是第一页需手动置空列表
      }
      data.dataList = data.dataList.concat(curPageData); // 追加新数据
      if (data.newInitOption[props.valueKey]) {
        data.dataList = data.dataList.filter((item) => {
          return item[props.valueKey] !== data.newInitOption[props.valueKey];
        });
        data.dataList.unshift(data.newInitOption);
      }
      data.page.total = apiData.total || data.dataList.length;
      if (data.dataList.length >= data.page.total && data.dataList.length !== 0) {
        data.bottomText = "已经到底啦~";
      } else if (data.dataList.length === 0) {
        data.bottomText = "暂无可用数据";
      }
    } catch (err) {
      data.bottomText = "暂无可用数据";
    }
  };
  const onReset = async () => {
    data.page = {
      num: props.pageNum,
      size: props.pageSize,
      total: 0
    };
    data.dataList = [];
    await loadList();
  };
  const onInit = async () => {
    data.isInitPage = false;
    if (
      value.value !== "" &&
      !data.newInitOption[props.valueKey] &&
      props.initRemoteKey &&
      props.getApi
    ) {
      const params = getParams({ ...props.params, ...data.remoteParams });
      const res = await props.getApi({
        ...params,
        [props.initRemoteKey]: value.value
      });
      if (res.data.data && res.data.data.length !== 0)
        data.newInitOption = {
          ...res.data.data[0]
        };
    } else {
      await onReset();
    }
  };
  const onChange = (e: any) => {
    if (data.isInitPage && props.getApi) onInit();
    const filterList = data.dataList.filter((item: any) => {
      return item[props.valueKey] === e;
    });
    emits("change", filterList[0] || {});
  };
  const onSearch = async (query: any) => {
    if (props.remoteMethod) {
      data.remoteParams = props.remoteMethod(query);
    }
    await onReset();
  };
  const onVisibleChange = (isShow: boolean) => {
    if (props.getApi) {
      // 显示下拉框时判断下拉框中是否存在选中的参数如果不存在且存在搜索参数 则重置
      const isSelect = data.dataList.filter((item) => {
        return value.value === item[props.valueKey];
      });
      if (isShow && isSelect.length === 0 && Object.keys(data.remoteParams).length !== 0) {
        data.remoteParams = {};
        onReset();
      }
    }
    emits("visibleChange", isShow);
  };
  watch(
    () => props.initOption,
    (val) => {
      data.newInitOption = val;
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.optionList,
    (val) => {
      if (!props.getApi) {
        data.dataList = val;
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.params,
    (val, oldVal) => {
      if (!isEqual(val, oldVal) && !data.isInitPage) {
        data.isInitPage = true;
        emits("update:modelValue", "");
        onInit();
      }
    },
    {
      immediate: true
    }
  );
  if ((props.isInitLoad || props.modelValue) && props.getApi) onInit();
  defineExpose({
    onReset
  });
</script>

<style scoped></style>
