import type { Config } from "jest";

const config: Config = {
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.(mt|t|cj|j)s$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

export default config;
