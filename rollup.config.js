import glob from "glob";
import path from "path";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import htmlBundle from "rollup-plugin-html-bundle";
import copy from "rollup-plugin-copy";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

const watcher = (globs) => ({
  buildStart() {
    for (const item of globs) {
      glob.sync(path.resolve(item)).forEach((filename) => {
        this.addWatchFile(filename);
      });
    }
  },
});

export default {
  input: "src/main.js",
  output: {
    file: "build/bundle.js",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [
    watcher(["src/index.html"]),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser(), // minify, but only in production
    htmlBundle({
      inline: true,
      template: "src/index.html",
      target: "dist/index.html",
    }),
    copy({
      targets: [
        { src: "src/favicon.ico", dest: "dist/" },
        { src: "src/logo.png", dest: "dist/" },
      ],
    }),
    !production &&
      serve({
        open: true,
        contentBase: "dist",
      }),
    !production &&
      livereload({
        watch: "dist",
      }),
  ],
};
