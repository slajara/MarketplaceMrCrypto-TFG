import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../../apps/hardhat",
      commands: {
        build: "pnpm compile",
        rebuild: "pnpm compile",
        clean: "",
      },
    }),
  ],
});
