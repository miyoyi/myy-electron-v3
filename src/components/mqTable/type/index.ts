import { TableColumnData } from "@arco-design/web-vue";

export interface Columns extends TableColumnData {
  title: string | undefined;
  tsx?: any;
}
