import { App } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, RadarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent
} from "echarts/components";
import Chart from "./chart/index.vue";
import Breadcrumb from "./breadcrumb/index.vue";
import MqSelect from "./mqSelect/index.vue";
import MqTable from "./mqTable/index.vue";
import MqContainer from "./mqContainer/index.vue";
import MqAdvanceQuery from "./mqAdvanceQuery/index.vue";
import MqModal from "./mqModal/index.vue";

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent
]);

export default {
  install(Vue: App) {
    Vue.component("Chart", Chart);
    Vue.component("Breadcrumb", Breadcrumb);
    Vue.component("MqSelect", MqSelect);
    Vue.component("MqTableList", MqTable);
    Vue.component("MqContainer", MqContainer);
    Vue.component("MqAdvanceQuery", MqAdvanceQuery);
    Vue.component("MqModal", MqModal);
  }
};
