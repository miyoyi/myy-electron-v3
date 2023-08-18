import { nextTick, reactive } from "vue";
import deepClone from "@/utils/deepClone";

export function useTable(options: { queryModel: any; mqTable: any }) {
  const tableData = reactive({
    form: options.queryModel(),
    params: {}
  });
  const onQuery = () => {
    tableData.params = deepClone(tableData.form);
    nextTick(() => {
      options.mqTable.value.reloadDataList();
    });
  };
  const onResetQuery = () => {
    tableData.form = options.queryModel();
    tableData.params = deepClone(tableData.form);
    nextTick(() => {
      options.mqTable.value.reloadDataList();
    });
  };

  // 通过返回值暴露所管理的状态
  return {
    tableData,
    onQuery,
    onResetQuery
  };
}
