import { SandpackSetupConfig } from ".";

export const ReactMapGlMapbox1: SandpackSetupConfig = {
  targetSourceFile: "/App.js",
  setup: {
    dependencies: {
      react: "^17.0.0",
      "react-dom": "^17.0.0",
      "react-scripts": "^4.0.0",
      "react-map-gl": "^7.0.0",
      "mapbox-gl": "^1.13.0",
    },
    entry: "/index.js",
    environment: "create-react-app",
  },
  defaultFiles: {
    "/index.js": {
      code: 'import React, { StrictMode } from "react";\nimport ReactDOM from "react-dom";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n  rootElement\n);',
      hidden: true,
    },
    "/styles.css": {
      code: "body {\n  margin:0;\n  padding:0;\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}",
      hidden: true,
    },
    "/public/index.html": {
      code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
      hidden: true,
    },
  },
};
