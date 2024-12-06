import { SandpackSetupConfig } from ".";

export const vue3: SandpackSetupConfig = {
  targetSourceFile: "/src/App.vue",
  setup: {
    dependencies: {
      "core-js": "^3.6.5",
      vue: "^3.0.0-0",
      "@vue/cli-plugin-babel": "4.5.0",
    },
    entry: "/src/main.js",
    environment: "vue-cli",
  },
  defaultFiles: {
    "/src/main.js": {
      code: "import { createApp } from 'vue'\nimport App from './App.vue'\n            \ncreateApp(App).mount('#app')            \n",
      hidden: true,
    },
    "/public/index.html": {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width,initial-scale=1.0" />\n    <title>codesandbox</title>\n  </head>\n  <body>\n    <noscript>\n      <strong\n        >We\'re sorry but codesandbox doesn\'t work properly without JavaScript\n        enabled. Please enable it to continue.</strong\n      >\n    </noscript>\n    <div id="app"></div>\n    <!-- built files will be auto injected -->\n  </body>\n</html>\n',
      hidden: true,
    },
  }
};
