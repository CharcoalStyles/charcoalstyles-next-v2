---
created: 2024-07-20 16:10:00+10:00
title: Simplification with TurfJS for live thumbnails
section: blog
tags: [turfJS, tool]
---

A project I worked on a while back had 'live' thumbnails of some geospatial data. I used [TurfJS](https://turfjs.org/) to simplify the data before displaying it in a small [react-map-gl](https://visgl.github.io/react-map-gl/) map.

---

Initially, this was fine, we had some test data to work with and they all looked good. But as with all live sites with updating data, we eventually found an edge case where the data was simplified too much.

To find a solution, I created a little too to interactively find the right simplification tolerance for the data.

```js type=demo template=react-map-gl-mapbox height=400px dependency=@turf/simplify dependency=@turf/bbox
import Map, { Source, Layer, MapRef } from "react-map-gl";
import simplify from "@turf/simplify";
import bbox from "@turf/bbox";
import { sampleData } from "./data.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

const toleranceMax = 0.02;

export default function App() {
   const [{ width, height }, setSize] = useState({
    width: 320,
    height: 180,
  });
  const [geojson, setGeojson] = useState("");
  const [tolerance, setTolerance] = useState(0.01);
  const [simplified, setSimplified] = useState("");
  const [loaded, setLoaded] = useState([false, false]);
  const [bbArea, setBbArea] = useState(0);
  const [featureArea, setFeatureArea] = useState(0);

  const mapOrigRef = useRef(null);
  const mapSimpRef = useRef(null);

  useEffect(() => {
    if (loaded[0] && loaded[1]) {
      setGeojson(JSON.stringify(birdSm));
    }
  }, [loaded]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "100vw",
        maxHeight: "100vh"
      }}
    >
      <div style={{ minWidth: "30vw", maxWidth: "30vw" }}>
        {geojson && geojson.map((layer) => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                width: "calc(30vw - 2em)",
                height: "3em",
                margin: '0.25em',
                padding: "0.5em",
                border: `solid 0.2em ${layer.properties.color}`,
                color: layer.properties.color,
                backgroundColor: '#222'
              }}
              key={layer.properties.name}
            >
              {layer.properties.name}
            </div>
          );
        })}
      </div>
      <div style={{ minWidth: "70vw", maxWidth: "7vw" }}>
        <Map
          id="mymap"
          initialViewState={{
            longitude: 10.139,
            latitude: 54.323333,
            zoom: 13
          }}
          style={{ width: "100%", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={
            "pk.eyJ1IjoiY2hhcmNvYTEiLCJhIjoiY2t0MWQwZTdxMGRyMDJwc2MyNXlxaTB3byJ9.dRcI1hBkrZgEkrOBzYJ7kg"
          }
        >
          {geojson && geojson.map((layer) => {
            return (
              <Source key={layer.properties.name} type="geojson" data={layer}>
                <Layer
                  {...{
                    id: layer.properties.name,
                    type: "fill",
                    paint: {
                      "fill-color": ["get", "color"],
                    }
                  }}
                />
              </Source>
            );
          })}
        </Map>
      </div>
    </div>
  );
}


~!~/data.js!~!
export const sampleData =  {
  "type": "Feature",
  "properties": {name: "The First Polygon", color: "#4499aa"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.136990547180176,
          54.327260918854144
        ],
        [
          10.136175155639648,
          54.32408245755525
        ],
        [
          10.141410827636719,
          54.32375708939148
        ],
        [
          10.142183303833008,
          54.32691054933894
        ],
        [
          10.136990547180176,
          54.327260918854144
        ]
      ]
    ]
  }
};
```
