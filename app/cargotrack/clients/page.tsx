'use client';

import Map from "ol/map";
import View from "ol/View";
import TileLayer from "ol/layer/tile";
import { OSM } from "ol/source";
import "ol/ol.css";
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
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