import { SandpackSetupConfig } from ".";

export const vue: SandpackSetupConfig = {
  targetSourceFile: "/src/App.vue",
  setup: {
    dependencies: {
      vue: "^2.6.11",
      "@vue/cli-plugin-babel": "4.1.1",
    },
    entry: "/src/main.js",
    environment: "vue-cli",
  },
  defaultFiles: {
    "/src/main.js": {
      code: 'import Vue from "vue";\nimport App from "./App.vue";\n\nVue.config.productionTip = false;\n\nnew Vue({\n  render: h => h(App)\n}).$mount("#app");\n',
      hidden: true,
    },
    "/public/index.html": {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width,initial-scale=1.0" />\n    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />\n    <title>codesandbox</title>\n  </head>\n  <body>\n    <noscript>\n      <strong\n        >We\'re sorry but codesandbox doesn\'t work properly without JavaScript\n        enabled. Please enable it to continue.</strong\n      >\n    </noscript>\n    <div id="app"></div>\n    <!-- built files will be auto injected -->\n  </body>\n</html>\n',
      hidden: true,
    },
  }
};
