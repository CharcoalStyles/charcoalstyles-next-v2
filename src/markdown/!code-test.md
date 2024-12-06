---
created: 2021-08-19T09:04:00+10:00
# modified: 2021-06-06T12:06:53+11:00
section: blog
tags: [test, codesandbox]
title: Code Blocks Tests
---

Testing code blocks!

---

A Paragraph with some `inline code`!

A non-typed (default static) block code

```shell
sudo apt install nvm
```

A typed static block code

```ts type=react
export type StringOrNumber = string | number;
```

A typed interactive code block

```js type=interactive template=mapbox-gl-js-v1 dependency=@turf/buffer%6.2.0 height=400px
import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { point } from "@turf/helpers";
import mapboxgl from "mapbox-gl";
import buffer from "@turf/buffer";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWdyaXR0cyIsImEiOiJjaXI2d2x0eXkwMHA4ZzdtMzJvb3k2eDBpIn0.wIgrA9uQggw7FwyNGA_4AQ";

const lngLat = [149.12656, -35.30654];

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: lngLat,
  zoom: 9,
});

map.on("load", () => {
  map.addLayer({
    id: "poly",
    type: "fill",
    source: {
      type: "geojson",
      data: buffer(point(lngLat), 5),
    },
    paint: {
      "fill-color": "#8844dd",
    },
  });
});
```

A typed interactive code block, with multi file splits!

```js type=interactive template=mapbox-gl-js-v1 dependency=@turf/buffer%6.2.0 height=400px
import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { point } from "@turf/helpers";
import mapboxgl from "mapbox-gl";
import buffer from "@turf/buffer";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWdyaXR0cyIsImEiOiJjaXI2d2x0eXkwMHA4ZzdtMzJvb3k2eDBpIn0.wIgrA9uQggw7FwyNGA_4AQ";

const lngLat = [149.12656, -35.30654];

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: lngLat,
  zoom: 7,
});

map.on("load", () => {
  map.addLayer({
    id: "poly",
    type: "fill",
    source: {
      type: "geojson",
      data: buffer(point(lngLat), 50),
    },
    paint: {
      "fill-color": "#44dd88",
    },
  });
});

~!~/index.html!~!
<!DOCTYPE html>
<html>

<head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
</head>

<body>
    <div id="head"><h2>This is a test</h2></div>
    <div id="map"></div>
    <script src="src/index.js"></script>
</body>

</html>
~!~/src/styles.css!~!
#head{
  height: 10vh;
}
#map{
  height: 80vh;
}
```
