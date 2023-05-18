import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  // setupFilesAfterEnv: ["./jest.setup.redis-mock.js"],
};

export default config;
