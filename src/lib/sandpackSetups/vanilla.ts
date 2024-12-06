import { SandpackSetupConfig } from ".";

export const vanilla: SandpackSetupConfig = {
  targetSourceFile: "/index.js",
  setup: {
    dependencies: {},
    entry: "/index.js",
    environment: "parcel",
  },
  defaultFiles: {
    "/styles.css": {
      code: "body {\n  font-family: sans-serif;\n}\n",
      hidden: true,
    },
    "/index.html": {
      code: '<!DOCTYPE html>\n<html>\n\n<head>\n  <title>Parcel Sandbox</title>\n  <meta charset="UTF-8" />\n</head>\n\n<body>\n  <div id="app"></div>\n\n  <script src="src/index.js">\n  </script>\n</body>\n\n</html>',
      hidden: true,
    },
  },
};
