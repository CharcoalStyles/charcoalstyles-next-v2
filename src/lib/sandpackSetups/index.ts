import { SandpackSetup } from "@codesandbox/sandpack-react";

import { mapboxGlJsV1 } from "./mapbox-gl-js-v1";
import { react } from "./react";
import { ReactMapGlMapbox1 } from "./react-map-gl-mapbox1";
import { vanilla } from "./vanilla";
import { vue } from "./vue";
import { vue3 } from "./vue3";
import { reactTailwind } from "./react-tailwind";

export type TemplateSetup =
  | "mapbox-gl-js-v1"
  | "react-map-gl-mapbox"
  | "react"
  | "react-tailwind"
  | "vanilla"
  | "vue"
  | "vue3";

export type SandpackSetupConfig = {
  setup: SandpackSetup;
  targetSourceFile: string;
  defaultFiles?: Record<
    string,
    {
      code: string;
      hidden?: boolean;
    }
  >;
  externalResources?: string[];
};

export const SandpackSetups: Record<TemplateSetup, SandpackSetupConfig> = {
  "mapbox-gl-js-v1": mapboxGlJsV1,
  "react-map-gl-mapbox": ReactMapGlMapbox1,
  react,
  "react-tailwind": reactTailwind,
  vanilla,
  vue,
  vue3,
};
