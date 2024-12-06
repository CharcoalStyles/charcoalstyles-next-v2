import { SandpackSetupConfig } from ".";

import { mapIndex, mapStyle } from "./template";

export const mapboxGlJsV2: SandpackSetupConfig = {
  targetSourceFile: "/src/index.js",
  setup: {
    dependencies: {
      "mapbox-gl": "^2.4.1",
    },
    entry: "/src/index.js",
    environment: "parcel",
  },
  defaultFiles: {
    "/src/styles.css": {
      code: mapStyle,
      hidden: true
    },
    "/index.html": {
      code: mapIndex,
      hidden: true
    },
  },
};
