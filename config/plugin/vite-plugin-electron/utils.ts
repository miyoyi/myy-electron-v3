import chalk from "chalk";
import type { ViteDevServer } from "vite";

export const logVPE = (...i: any[]) => console.log(chalk.hex("#F65A83").bold("VPE"), ...i);

export const getAddress = (server: ViteDevServer, process: NodeJS.Process) => {
  const address = server.httpServer?.address();
  if (!address) {
    logVPE(chalk.red("Startup failed: get vite server address defeated"));
    process.exit(1);
  }
  if (typeof address === "string") {
    logVPE(chalk.red(`Invalid address type${address}`));
    process.exit(1);
  }
  const LoadUrl = `http://${address.address}:${address.port}`;
  return LoadUrl;
};
