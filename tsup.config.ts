import { defineConfig } from "tsup";

export default defineConfig({
  format: "cjs", // 输出cjs
  sourcemap: false,
  entry: ["electron/*"],
  outDir: "output/electron", // * 编译生成的文件存放路径
  target: "node16",
  skipNodeModulesBundle: true,
  clean: true,
  platform: "node",
  dts: false
});
