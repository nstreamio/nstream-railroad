import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const nstream_railroad = {
  input: "./lib/nstream-railroad/index.js",
  output: {
    file: "./dist/nstream-railroad.js",
    name: "nstream.railroad",
    format: "iife",
    globals: {
      "@swim/runtime": "swim",
      "@swim/toolkit": "swim",
      "@swim/platform": "swim",
    },
    sourcemap: true,
    interop: "esModule",
  },
  external: [
    "@swim/runtime",
    "@swim/toolkit",
    "@swim/platform",
  ],
  plugins: [
    nodeResolve(),
    sourcemaps(),
  ],
};

export default [nstream_railroad];
