---
created: 2022-02-18T15:38:23+11:00
title: Using react-beautiful-dnd with react-map-gl
section: blog
tags: [React, react-map-gl, react-beautiful-dnd]
---

Mapbox GL JS, as most mapping libraries use the concept of layers to organise what is shown on a map. Layers that are above others render over the top of ones below. [React-map-gl](https://visgl.github.io/react-map-gl/) also uses this concept, but because it follows the JSX components, reorganising the layers can be a bit of a headache.

---

## Setup the map and the Layer UI

Let's first setup a basic react-map-gl map with a few layers that overlap each other and a UI that has the layers listed.

```js type=interactive template=react-map-gl-mapbox height=400px
import Map, { Source, Layer } from "react-map-gl";
import { geojsonLayers } from "./data.js";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App() {
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
        {geojsonLayers.map((layer) => {
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
          {geojsonLayers.map((layer) => {
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
const firstPolygon =  {
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

const secondPolygon = {
  "type": "Feature",
  "properties": {name: "The Second Polygon", color: "#aa4499"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.132441520690918,
          54.32588445001792
        ],
        [
          10.13184070587158,
          54.322330444754094
        ],
        [
          10.137763023376465,
          54.3221552393699
        ],
        [
          10.138449668884277,
          54.325684232531565
        ],
        [
          10.132441520690918,
          54.32588445001792
        ]
      ]
    ]
  }
};

const thirdPolygon = {
  "type": "Feature",
  "properties": {name: "Third Polygon", color: "#99aa44"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.142784118652344,
          54.32706070806807
        ],
        [
          10.130681991577148,
          54.321955003731375
        ],
        [
          10.137720108032227,
          54.32115405143091
        ],
        [
          10.142483711242674,
          54.323732060964595
        ],
        [
          10.142784118652344,
          54.32706070806807
        ]
      ]
    ]
  }
};

export const geojsonLayers = [firstPolygon, secondPolygon, thirdPolygon];
```

## Enable drag and drop

Next step is to enable Drag and Drop of the layers in hte UI. when I had to do this for [Mapily](http://mapily.site), I found the [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd) package. It's very full featured, if a little hard to set up; when getting the sample below up and running took me about an hour 🤦‍♂️

Basically, to set it up you have a set of React Components that you setup in a specific nested structure:

```jsx type=static
<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="droppable">
    {(dropProvided) => (
      <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
        {items.map((item, index) => (
          <Draggable
            key={`draggable-${index}`}
            draggableId={`draggable-${index}`}
            index={index}
          >
            {(dragProvided, snapshot) => (
              <div
                ref={dragProvided.innerRef}
                {...dragProvided.draggableProps}
                {...dragProvided.dragHandleProps}
              >
                Drag Me!
                {dragProvided.placeholder}
              </div>
            )}
          </Draggable>
        ))}
        {dropProvided.provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

- `<DragDropContext>` Sets up the area that contains the places you can drop items, the items you can drag, and then the callbacks to handle what happens when things are dragged and dropped
- `<Droppable>` Is the place where you can drop draggable items. It uses a pattern I've never seem before in React, it's children prop is a specific function with two arguments that must return a ReactElement. These two arguments provide some props that need to be placed around the child components to make the drag and dropping work.
- `<Draggable>` This defines an item that can be dragged. It too follows the pattern around the children prop expecting to receive a function with a specific signature that returns a ReactElement.

```js type=interactive template=react-map-gl-mapbox height=400px dependency=react-beautiful-dnd
import { useState } from "react";
import Map, { Source, Layer } from "react-map-gl";
import { geojsonLayers } from "./data.js";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

export default function App() {
  const [layers, setLayers] = useState(geojsonLayers);

  const onDragEnd = (result) => {
    const newLayers = [...layers];
    const [removed] = newLayers.splice(result.source.index, 1);
    newLayers.splice(result.destination.index, 0, removed);
    setLayers(newLayers);
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(dropProvided) => (
              <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                {layers.map((item, index) => (
                  <Draggable
                    key={item.properties.name}
                    draggableId={`draggable-${item.properties.name}`}
                    index={index}
                  >
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          width: "calc(30vw - 2em)",
                          height: "3em",
                          margin: "0.25em",
                          padding: "0.5em",
                          border: `solid 0.2em ${item.properties.color}`,
                          color: item.properties.color,
                          backgroundColor: "#222",
                          ...dragProvided.draggableProps.style,
                        }}
                      >
                        {item.properties.name}
                        {dragProvided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
          {layers.map((layer) => {
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
const firstPolygon =  {
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

const secondPolygon = {
  "type": "Feature",
  "properties": {name: "The Second Polygon", color: "#aa4499"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.132441520690918,
          54.32588445001792
        ],
        [
          10.13184070587158,
          54.322330444754094
        ],
        [
          10.137763023376465,
          54.3221552393699
        ],
        [
          10.138449668884277,
          54.325684232531565
        ],
        [
          10.132441520690918,
          54.32588445001792
        ]
      ]
    ]
  }
};

const thirdPolygon = {
  "type": "Feature",
  "properties": {name: "Third Polygon", color: "#99aa44"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.142784118652344,
          54.32706070806807
        ],
        [
          10.130681991577148,
          54.321955003731375
        ],
        [
          10.137720108032227,
          54.32115405143091
        ],
        [
          10.142483711242674,
          54.323732060964595
        ],
        [
          10.142784118652344,
          54.32706070806807
        ]
      ]
    ]
  }
};

export const geojsonLayers = [firstPolygon, secondPolygon, thirdPolygon];
```

## Hook up map layers with Layer UI

You might have noticed that while the drag and drop is working, updating the state that drives both the Layer UI and the source and layers in the map. **But** the map doesn't update! This is because React-Map-GL doesn't exclusively use the hierarchy of the ReactElements to drive how the layers are rendered on the map.

But the Layer Element has a prop that allows us to give another layer's ID that we want our layer to render below. Below I've snipped out the updated code that handles the layers rendering on the map.

```js type=static
{
  layers.map((layer, sourceIndex) => {
    const sourceId = `source-${layer.properties.name}`;
    const layerId = `layer-${layer.properties.name}`;
    const beforeId =
      sourceIndex === 0
        ? undefined
        : `layer-${layers[sourceIndex - 1].properties.name}`;

    return (
      <Source id={sourceId} key={sourceId} type="geojson" data={layer}>
        <Layer
          beforeId={beforeId}
          {...{
            id: layerId,
            type: "fill",
            paint: {
              "fill-color": ["get", "color"],
            },
          }}
        />
      </Source>
    );
  });
}
```

As we iterate through the different layers, we create IDs for the Source and the Layer, we also generate the ID for the layer that came before it and if it's the first one, we set it as undefined. With this ID, we can pass it to the Layer to the beforeId prop, it is then placed underneath the layer provided.

With those two changes, the map works as intended! Check out the complete demo below.

## Finished Demo

```js type=interactive template=react-map-gl-mapbox height=400px dependency=react-beautiful-dnd
import { useState } from "react";
import Map, { Source, Layer } from "react-map-gl";
import { geojsonLayers } from "./data.js";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

export default function App() {
  const [layers, setLayers] = useState(geojsonLayers);

  const onDragEnd = (result) => {
    const newLayers = [...layers];
    const [removed] = newLayers.splice(result.source.index, 1);
    newLayers.splice(result.destination.index, 0, removed);
    setLayers(newLayers);
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(dropProvided) => (
              <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                {layers.map((item, index) => (
                  <Draggable
                    key={item.properties.name}
                    draggableId={`draggable-${item.properties.name}`}
                    index={index}
                  >
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          width: "calc(30vw - 2em)",
                          height: "3em",
                          margin: "0.25em",
                          padding: "0.5em",
                          border: `solid 0.2em ${item.properties.color}`,
                          color: item.properties.color,
                          backgroundColor: "#222",
                          ...dragProvided.draggableProps.style,
                        }}
                      >
                        {item.properties.name}
                        {dragProvided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
          {layers.map((layer, sourceIndex) => {
            const beforeId =
                sourceIndex === 0
                  ? undefined
                  : layers[sourceIndex - 1].properties.name;

            return (
              <Source
                id={layer.properties.name}
                key={layer.properties.name}
                type="geojson"
                data={layer}
              >
                <Layer
                beforeId={beforeId}
                  {...{
                    id: `${layer.properties.name}`,
                    type: "fill",
                    paint: {
                      "fill-color": ["get", "color"]
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
const firstPolygon =  {
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

const secondPolygon = {
  "type": "Feature",
  "properties": {name: "The Second Polygon", color: "#aa4499"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.132441520690918,
          54.32588445001792
        ],
        [
          10.13184070587158,
          54.322330444754094
        ],
        [
          10.137763023376465,
          54.3221552393699
        ],
        [
          10.138449668884277,
          54.325684232531565
        ],
        [
          10.132441520690918,
          54.32588445001792
        ]
      ]
    ]
  }
};

const thirdPolygon = {
  "type": "Feature",
  "properties": {name: "Third Polygon", color: "#99aa44"},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.142784118652344,
          54.32706070806807
        ],
        [
          10.130681991577148,
          54.321955003731375
        ],
        [
          10.137720108032227,
          54.32115405143091
        ],
        [
          10.142483711242674,
          54.323732060964595
        ],
        [
          10.142784118652344,
          54.32706070806807
        ]
      ]
    ]
  }
};

export const geojsonLayers = [firstPolygon, secondPolygon, thirdPolygon];
```
