<template>
  <a-table
    v-bind="$attrs"
    :data="data.dataList"
    :scroll="data.scroll"
    :size="'medium'"
    :bordered="data.bordered"
    :table-layout-fixed="true"
    :stripe="true"
    :column-resizable="true"
    :pagination="data.pagination"
    :loading="data.loading"
    @page-change="onPageChange">
    <template #pagination-left>
      <div>共 {{ data.pagination.total }} 条</div>
      <a-select
        v-model:model-value="data.selectPageCount"
        class="pagination-select-page"
        size="small"
        @change="changePageCount">
        <a-option :value="10">10条/页</a-option>
        <a-option :value="20">20条/页</a-option>
        <a-option :value="30">30条/页</a-option>
        <a-option :value="50">50条/页</a-option>
        <a-option :value="100">100条/页</a-option>
      </a-select>
    </template>
    <template #pagination-right>
      前往
      <a-input
        v-model:model-value="data.pagination.inputPage"
        class="pagination-input-page"
        size="small"
        @press-enter="onEnterInputPage" />
      页
    </template>
    <template #columns>
      <template v-for="column in columns" :key="column.dataIndex">
        <a-table-column
          :title="column.title"
          :data-index="column.dataIndex"
          :ellipsis="column.ellipsis || true"
          :tooltip="column.tooltip || true"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align || 'center'">
          <template v-if="column.tsx" #cell="{ record }">
            <tsx-dom :column="column" :row="record" :tsx="column.tsx" />
          </template>
        </a-table-column>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  /**
   * mq-table 表格
   * @description mq-table 支持全部table参数。
   * @tutorial https://arco.design/vue/component/table
   * @property {Columns} columns 表格数据
   * @property {Object} tableParams 查询参数
   * @property {Function} api 查询接口
   * @example mq-table-list ref="mqTable" :columns="columns" :api="getPlatTicketOrderPage" :table-params="tableData.params" ></mq-table-list>
   */
  import { reactive, watch } from "vue";
  import type { PaginationProps, TableColumnData } from "@arco-design/web-vue";
  import tsxDom from "@/components/tsxDom/index.vue";
  import { Columns } from "./type";

  interface Props {
    columns: Columns[];
    tableParams?: {
      [key: string]: any;
    };
    api(params: any): any;
  }

  interface Pagination extends PaginationProps {
    current: number;
    inputPage: string;
    pageSize: number;
    total: number;
    pageCount: number;
  }
  // 基础参数
  const data: {
    pagination: Pagination;
    scroll: {
      [key: string]: any;
    };
    bordered: {
      [key: string]: any;
    };
    dataList: TableColumnData[];
    selectPageCount: number;
    loading: boolean;
  } = reactive({
    scroll: {
      x: 1
    },
    bordered: {
      cell: true
    },
    pagination: {
      current: 1,
      inputPage: "1",
      pageSize: 10,
      total: 0,
      pageCount: 0,
      size: "small"
    },
    dataList: [],
    selectPageCount: 10,
    loading: false
  });
  const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    tableParams: () => {
      return {};
    }
  });
  // 获取分页数据
  const getDataList = async () => {
    data.loading = true;
    const { pageSize, current } = data.pagination;
    const params: any = {
      ...props.tableParams,
      pageSize,
      page: current
    };
    try {
      const res = await props.api(params);
      data.dataList = [];
      data.dataList = res.data.data;
      data.pagination.total = res.data.total;
      data.pagination.pageCount = Math.ceil(data.pagination.total / data.pagination.pageSize);
    } catch (err) {
      data.pagination.current -= 1;
    }
    data.loading = false;
  };
  const reloadDataList = () => {
    data.pagination.current = 1;
    getDataList();
  };
  watch(
    () => data.pagination.current,
    (val) => {
      if (data.pagination.inputPage !== `${val}`) {
        data.pagination.inputPage = `${val}`;
      }
    }
  );
  // 监听并限制分页大小
  watch(
    () => data.pagination.inputPage,
    (val) => {
      if (+val > data.pagination.pageCount) {
        data.pagination.inputPage = `${data.pagination.pageCount}`;
      } else if (+val <= 0) {
        data.pagination.inputPage = "1";
      }
    }
  );
  // 切换分页页码
  const onPageChange = (page: number) => {
    data.pagination.current = page;
    getDataList();
  };
  // 切换分页页数
  const changePageCount = (pageSize: any) => {
    data.pagination.pageSize = pageSize as number;
    data.pagination.current = 1;
    getDataList();
  };
  // 分页输入框查询
  const onEnterInputPage = () => {
    data.pagination.current = +data.pagination.inputPage;
    getDataList();
  };
  getDataList();
  defineExpose({
    reloadDataList
  });
</script>

<style lang="less" scoped>
  :deep(.pagination-select-page) {
    width: 110px;
    margin-left: 20px;
  }
  .pagination-input-page {
    width: 60px;
    margin: 0 10px;
    :deep(.arco-input) {
      text-align: center;
    }
  }
</style>
