import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../hardhat",
      commands: {
        build: "pnpm compile",
        rebuild: "pnpm compile",
        clean: "",
      },
    }),
    react(),
  ],
});
