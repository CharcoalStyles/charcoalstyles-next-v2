---
created: 2021-08-17T08:49:00+11:00
updated: 2022-03-29T13:33:00+10:00
section: blog
tags: [mapbox-gl-js]
title: Create a Mapbox GL JS (v1) map from scratch
---

[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) is a great library for visualising geospatial data in an interactive map on a web site. The library provides many different ways of rendering data, from markers for single points to fully 3D extruded polygons!

---

Mapbox also provide some really nice basemaps to give context to your data and the [Mapbox Studio](https://www.mapbox.com/mapbox-studio/) to create your own basemaps.

The library allows easy importing of Vector Tiles and GeoJSON as data sources and then render this data on the map using layers.

## Setup

We're going to create a webpage with a full-page interactive map using Mapbox GL JS (v1). The map will be focused on [Douala, Cameroon](https://en.wikipedia.org/wiki/Douala). This tutorial assumes that you know how to create a basic webpage.

There is a v2 of Mapbox GL JS, it adds some [**really nice**](https://www.mapbox.com/blog/mapbox-gl-js-v2-3d-maps-camera-api-sky-api-launch) new shiny things and performance increases. But it also charges for each time the [map is loaded](https://www.mapbox.com/pricing/#maploads); there is _very_ generous monthly free tier, but I'm just really cheap and hoping many people view my stuff ;)

First step is to create a directory with the following directory structure:

- index.html
- src/style.css
- src/index.js

## HTML

Create a basic webpage in `index.html` with a `div` that has an `id` of `map`. Later on the map will be loaded into this div.

Also add in links to:

- `style.css` in the header and
- `index.js` in the body, under the `div`.

Your `index.html` file should look like this

```html type=static folded
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My first Mapbox GL JS map!</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link href="src/style.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map"></div>
  </body>
  <script src="src/index.js"></script>
</html>
```

## Mapbox GL JS

To show a map on the webpage, we need to import the Mapbox GL JS library and associated CSS.

In the header we need to add the Mapbox GL JS CSS before our CSS:

```html type=static
<link
  href="https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.css"
  rel="stylesheet"
/>
```

And between the `div` and `index.js`, in the `body` add the Mapbox GL JS file:

```html type=static
<script src="https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.js"></script>
```

Your `index.html` file should look like this

```html type=static folded
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My first Mapbox GL JS map!</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.css"
      rel="stylesheet"
    />
    <link href="src/style.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map"></div>
  </body>
  <script src="https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.js"></script>
  <script src="src/index.js"></script>
</html>
```

## CSS

Two little CSS things here:

- Removing the padding from the `body`
- Making the map div the size of the page

In the `style.css` file add the following:

```css type=static
body {
  margin: 0;
  padding: 0;
}

#map {
  height: 100vh;
  width: 100vw;
}
```

## JS

Mapbox GL JS (v1) requires a [Mapbox access token](https://account.mapbox.com/access-tokens/) to use any of the Mapbox created or hosted basemaps. This is set by assigning it to the `accessToken` property of the library.

```js type=static
mapboxgl.accessToken = "<your access token here>";
```

To create the map, we call the `Map` constructor and pass an object of options to it. There are a lot of options that can be set, we wil be setting 4:

- `container`: The `id` of the `div` the map will be placed into.
- `style`: The style of the basemap.
- `center`: The longitude and latitude that the map is centred on when created.
- `zoom`: The zoom level of the map initially.

```js type=static
new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [9.698718, 4.054859],
  zoom: 11,
});
```

## Finished Demo

```js type=interactive template=vanilla height=400px dependency=mapbox-gl
// Ignore these, they are required to make the live code example work
import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
const mapboxgl = require("mapbox-gl");

// script.js starts from here

// Replace the token below with your own one.
// This token only works on this website ;)
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hhcmNvYTEiLCJhIjoiY2t0MWQwZTdxMGRyMDJwc2MyNXlxaTB3byJ9.dRcI1hBkrZgEkrOBzYJ7kg";

new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [9.698718, 4.054859],
  zoom: 11,
});
~!~/styles.css!~!
body {
  margin: 0;
  padding: 0;
}

#map {
  height: 100vh;
  width: 100vw;
}
~!~/index.html!~!
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My first Mapbox GL JS map!</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link href="styles.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map"></div>
  </body>
  <script src="index.js"></script>
</html>
```
