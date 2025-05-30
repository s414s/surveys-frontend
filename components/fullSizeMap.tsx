'use client';

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { useEffect } from "react";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import VectorSource from "ol/source/Vector";
import { Vector as VectorLayer } from 'ol/layer';

export default function FullSizeMap() {

    useEffect(() => {
        const redDotFeature = new Feature({
            geometry: new Point([0, 0]), // Coordinates in EPSG:3857
            name: "myName",
            // style: myOwnCircleStyle,
        });

        // Apply a red circle style to the feature
        redDotFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 4,
                    // fill: new Fill({ color: 'red' }),
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.8)',
                    }),
                    stroke: new Stroke({ color: 'black', width: 1 }),
                }),
            })
        );

        // Create a vector source and add the red dot feature to it
        const vectorSource = new VectorSource({
            features: [redDotFeature],
        });

        // Create a vector layer from the vector source
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const map = new Map({
            target: "map",
            controls: defaultControls().extend([
                new ScaleLine({
                    minWidth: 100, // Minimum width of the scale line in pixels
                    units: 'metric' // You can set to 'imperial' or 'nautical' as well
                })
            ]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });

        return () => { map.setTarget(undefined); };
    }, []);

    return (
        <div className="flex-1">
            <div
                id="map"
                style={{
                    width: "100%",
                    // height: "500px",
                    height: "100%"
                }}
            />
        </div>
    );
};