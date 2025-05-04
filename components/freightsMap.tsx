'use client';

import "ol/ol.css";
import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { defaults as defaultInteractions } from 'ol/interaction';
import XYZ from "ol/source/XYZ";
import { fromLonLat, transform } from "ol/proj";
import Point from "ol/geom/Point";
import { Style, Circle, Fill, Stroke } from 'ol/style';
import Feature, { FeatureLike } from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import TileLayer from "ol/layer/tile";
import KML from 'ol/format/KML';
import LineString from "ol/geom/LineString";
import { StyleFunction } from "ol/style/Style";
// import OSM from "ol/source/OSM";

const FreightsMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);

    const [, setOlMap] = useState<Map>();
    const intervalIdRef = useRef<number | null>(null);
    // const [, setSelectedFeature] = useState<Feature | null>(null);
    // const [, setLocation] = useState<Coordinate | null>(null);

    useEffect(() => {
        const baseLayer = new TileLayer({
            source: new XYZ({
                url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            })
        });


        // styleFunction: pick cityStyle for Points, pathStyle for LineStrings
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const styleFunction: StyleFunction = (feature: FeatureLike, resolution: number) => {
            const geom = feature.getGeometry();
            if (!geom) return;

            switch (geom.getType()) {
                case 'Point':
                    return cityStyle;
                case 'LineString':
                    return pathStyle;
                default:
                    return;
            }
        };

        const kmlLayers = ["/itinerarios1.kml", "/itinerarios2.kml"]
            .map(url => new VectorLayer({
                source: new VectorSource({
                    url,
                    format: new KML({ extractStyles: false }),
                }),
                style: styleFunction,
            }));

        const trucksPointsSource = new VectorSource();
        const trucksPointsLayer = new VectorLayer({
            source: trucksPointsSource,
            style: truckStyle
        });

        // const allFreights = freightsData?.map(x => {
        //     const feat = new Feature({
        //         geometry: new Point(fromLonLat([x.lon, x.lat])),
        //         name: x.name,
        //     });

        //     feat.setStyle(truckStyle);
        //     feat.setId(x.id ?? 0);
        //     feat.setProperties({
        //         "name": x.name,
        //         "plate": x.plate,
        //         "speed": x.speed,
        //     });
        //     // feat.set("myProperty", `${point.c}-${point.name}`);
        //     return feat;
        // });

        // const vectorSource = new VectorSource({ features: allFreights });
        // const trucksLayer = new VectorLayer({ source: vectorSource });

        const myLocationLayer = new VectorLayer({ source: new VectorSource() });

        myLocationLayer.set('name', 'myLocationLayer');

        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            interactions: defaultInteractions({ pinchRotate: false }),
            controls: defaultControls({ zoom: false, rotate: false })
                .extend([
                    new ScaleLine(),
                    // new Rotate({ autoHide: false, // Ensures the compass is always visible })
                ]),
            layers: [
                // new TileLayer({ source: new OSM() })
                baseLayer,
                // trucksLayer,
                myLocationLayer,
                ...kmlLayers,
                trucksPointsLayer,
            ],
            view: new View({
                center: fromLonLat([-0.8891, 41.6488]), // Note: OpenLayers uses [lon, lat] order
                zoom: 12
            })
        });

        // map.on("singleclick", (e: MapBrowserEvent<MouseEvent>) => {
        //     const toleranceInPixels = 20;
        //     const vectorSource = trucksLayer.getSource();
        //     if (!vectorSource) throw new Error("no points source found");

        //     // Find the closest feature to the clicked coordinate.
        //     const closestFeature = vectorSource.getClosestFeatureToCoordinate(e.coordinate);
        //     if (!closestFeature) return;

        //     const featureCoordinate = (closestFeature.getGeometry() as Point).getCoordinates();

        //     // Convert the feature's coordinate to pixel values.
        //     const featurePixel = map.getPixelFromCoordinate(featureCoordinate);

        //     const distanceClickToFeature = Math.sqrt(
        //         Math.pow(e.pixel[0] - featurePixel[0], 2) +
        //         Math.pow(e.pixel[1] - featurePixel[1], 2)
        //     );

        //     if (distanceClickToFeature <= toleranceInPixels) {
        //         setSelectedFeature(closestFeature);
        //     }
        // });

        setOlMap(map);

        intervalIdRef.current = window.setInterval(() => {
            kmlLayers.forEach(layer => {
                layer.getSource()?.getFeatures().forEach(feature => {
                    const geometry = feature.getGeometry();
                    if (geometry?.getType() === 'LineString') {

                        // Cast the geometry to LineString so TypeScript knows about getCoordinates()
                        // const lineString = geometry as LineString;
                        // const coordinates = lineString.getCoordinates();

                        // Map each coordinate from EPSG:3857 (default map projection) to EPSG:4326 (lon/lat)
                        // const lonLatCoordinates = coordinates.map(coord => transform(coord, 'EPSG:3857', 'EPSG:4326'));

                        // Now each element in lonLatCoordinates is in the format [longitude, latitude]
                        // lonLatCoordinates.forEach(([lon, lat]) => { console.log('Longitude:', lon, 'Latitude:', lat); });

                        // console.table(transform(coordinates[0], 'EPSG:3857', 'EPSG:4326'));
                        // console.table(transform(coordinates[1], 'EPSG:3857', 'EPSG:4326'));
                    }
                });
            });
        }, 3000);

        // Get features to represent cities and lorries
        kmlLayers.forEach(layer => {
            const src = layer.getSource()!;

            src.once('change', () => {
                if (src.getState() !== 'ready') return;

                src.getFeatures().forEach(feature => {
                    const geom = feature.getGeometry();
                    if (!geom) return;

                    // Cities
                    // if (geom.getType() === 'Point') {
                    // const point = geom as Point;
                    // const coord3857 = point.getCoordinates(); // Coordinates in map projection (EPSG:3857)
                    // const [lon, lat] = transform(coord3857, 'EPSG:3857', 'EPSG:4326');
                    // }

                    // Paths
                    if (geom.getType() === 'LineString') {
                        const line = geom as LineString;

                        // line.getCoordinates().forEach((c, i) => {
                        //     const [lon, lat] = transform(c, 'EPSG:3857', 'EPSG:4326');
                        //     console.log(`Line point #${i}:`, { lon, lat });
                        // });

                        const numberOfRandomPoints = 5;

                        for (let i = 0; i < numberOfRandomPoints; i++) {
                            // choose a random fraction between 0 and 1
                            const frac = Math.random();
                            // get the projected coordinate at that fraction
                            const coord = line.getCoordinateAt(frac);

                            // create a point feature and add it
                            const pt = new Feature({
                                geometry: new Point(coord)
                            });
                            pt.setStyle(truckStyle);
                            trucksPointsSource.addFeature(pt);
                        }
                    }
                });
            });
        });

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }

            map.setTarget(undefined);
        };
    }, []);

    return (
        <div
            id="map"
            className="h-full w-full relative overflow-hidden touch-none"
            ref={mapDivRef}
        >
        </div>
    );
};

export default FreightsMap;

const truckStyle = new Style({
    image: new Circle({
        radius: 6,
        fill: new Fill({
            color: '#4682B4' // Lighter blue color
        }),
        stroke: new Stroke({
            color: 'white',
            width: 2
        })
    }),
});

const cityStyle = new Style({
    image: new Circle({
        radius: 10,
        fill: new Fill({
            color: 'red' // Lighter blue color
        }),
        stroke: new Stroke({
            color: 'white',
            width: 2
        })
    }),
});

const pathStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
    }),
    stroke: new Stroke({
        color: '#FF00FF',
        width: 2,
    }),
});

// Function to transform from UTM Zone 30N to WGS84
export function utmToWgs84(easting: number, northing: number) {
    // Transform from UTM Zone 30N (EPSG:32630) to WGS84 (EPSG:4326)
    const wgs84Coords = transform([easting, northing], 'EPSG:32630', 'EPSG:4326');

    // wgs84Coords[0] is longitude, wgs84Coords[1] is latitude
    return {
        longitude: wgs84Coords[0],
        latitude: wgs84Coords[1]
    };
}

// Function to transform from WGS84 to UTM Zone 30N
export function wgs84ToUtm(longitude: number, latitude: number) {
    // Transform from WGS84 (EPSG:4326) to UTM Zone 30N (EPSG:32630)
    const utmCoords = transform([longitude, latitude], 'EPSG:4326', 'EPSG:32630');

    // utmCoords[0] is easting, utmCoords[1] is northing
    return {
        easting: utmCoords[0],
        northing: utmCoords[1]
    };
}