'use client';

import "ol/ol.css";
import { useEffect, useRef, useState } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { defaults as defaultInteractions } from 'ol/interaction';
import { MapPinIcon } from "lucide-react";
import XYZ from "ol/source/XYZ";
import { fromLonLat, transform } from "ol/proj";
import { Button } from "./ui/button";
import Point from "ol/geom/Point";
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Coordinate } from "ol/coordinate";
import { easeOut } from 'ol/easing';
import TileLayer from "ol/layer/tile";
// import TileLayer from "ol/layer/Tile";

// import { Input } from "./ui/input";
// import { Coordinate } from "ol/coordinate";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "./ui/separator";
// import Geolocation from 'ol/Geolocation.js';
// import { ApiResponse } from "./appTypes";
// import OSM from "ol/source/OSM";
// import Image from "next/image";

const FreightsMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);

    const [olMap, setOlMap] = useState<Map>();
    const [, setLocation] = useState<Coordinate | null>(null);
    const [, setSelectedFeature] = useState<Feature | null>(null);

    const handleGetLocation = () => {
        if (!navigator.geolocation) return;
        if (!olMap) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Transform from UTM Zone 30N (EPSG:32630) to WGS84 (EPSG:4326)
                const coords: Coordinate = fromLonLat([position.coords.longitude, position.coords.latitude]);
                setLocation(coords);
                // console.log("My current position:", coords);

                const myLayer = olMap?.getLayers()
                    .getArray()
                    .find(layer => layer.get('name') === 'myLocationLayer');

                if (!myLayer) { throw new Error("layer not found"); }

                const vectorSource = (myLayer as VectorLayer<VectorSource<Feature<Point>>>).getSource();
                vectorSource?.clear(); // Removes all features from this source

                const feature = new Feature({ geometry: new Point(coords) });
                feature.setStyle(myLocationStyle);
                vectorSource?.addFeature(feature);

                // olMap?.getView().setCenter(coords);
                olMap?.getView().animate({
                    center: coords,
                    zoom: 15,
                    duration: 500,
                    easing: easeOut // Smooth ease-in/ease-out transition
                });
            },
            (error) => { console.error("Error retrieving location:", error); },
            { maximumAge: 30_000 }
        );
    };

    useEffect(() => {
        const baseLayer = new TileLayer({
            source: new XYZ({
                url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            })
        });

        const allFreights = freightsData?.map(x => {
            const feat = new Feature({
                geometry: new Point(fromLonLat([x.lon, x.lat])),
                name: x.name,
            });

            feat.setStyle(treeStyle);
            feat.setId(x.id ?? 0);
            feat.setProperties({
                "name": x.name,
                "plate": x.plate,
                "speed": x.speed,
            });
            // feat.set("myProperty", `${point.c}-${point.name}`);
            return feat;
        });

        const vectorSource = new VectorSource({
            features: allFreights
        });

        // Create a vector layer with styling for red dots
        const pointsLayer = new VectorLayer({
            source: vectorSource,
        });

        const myLocationLayer = new VectorLayer({
            source: new VectorSource(),
        });
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
                pointsLayer,
                myLocationLayer
            ],
            view: new View({
                center: fromLonLat([-0.8891, 41.6488]), // Note: OpenLayers uses [lon, lat] order
                zoom: 12
            })
        });

        map.on("singleclick", (e: MapBrowserEvent<MouseEvent>) => {
            const toleranceInPixels = 20;
            const vectorSource = pointsLayer.getSource();
            if (!vectorSource) throw new Error("no points source found");

            // Find the closest feature to the clicked coordinate.
            const closestFeature = vectorSource.getClosestFeatureToCoordinate(e.coordinate);
            if (!closestFeature) { return; }

            const featureCoordinate = (closestFeature.getGeometry() as Point).getCoordinates();

            // Convert the feature's coordinate to pixel values.
            const featurePixel = map.getPixelFromCoordinate(featureCoordinate);

            const distanceClickToFeature = Math.sqrt(
                Math.pow(e.pixel[0] - featurePixel[0], 2) +
                Math.pow(e.pixel[1] - featurePixel[1], 2)
            );

            if (distanceClickToFeature <= toleranceInPixels) {
                setSelectedFeature(closestFeature);
                console.log("point located");
            }
        });

        setOlMap(map);

        return () => map.setTarget(undefined);
    }, []);

    return (
        <div
            id="map"
            className="h-full w-full relative overflow-hidden touch-none"
            ref={mapDivRef}
        >
            {/* <div className="absolute bottom-8 right-4 z-20">
                <Button
                    className="h-12 w-12 rounded-full"
                    onClick={handleGetLocation}
                >
                    <MapPinIcon />
                </Button>
            </div> */}

        </div>
    );
};

export default FreightsMap;

const treeStyle = new Style({
    image: new Circle({
        radius: 6,
        fill: new Fill({
            color: 'green'
        }),
        stroke: new Stroke({
            color: 'white',
            width: 2
        })
    }),
    // Add text label if name is provided
    text: new Text({
        // text: "hola",
        offsetY: -15,
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'white', width: 3 })
    })
});

const myLocationStyle = new Style({
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

type TruckIcon = {
    id: number,
    name: string,
    plate: string,
    speed: number,
    lon: number,
    lat: number,
};

const freightsData: TruckIcon[] = [
    { id: 1, name: "Freightliner Cascadia", plate: "ABC123", speed: 60, lon: -122.4194, lat: 37.7749 },
    { id: 2, name: "Volvo VNL", plate: "DEF456", speed: 55, lon: -118.2437, lat: 34.0522 },
    { id: 3, name: "Peterbilt 579", plate: "GHI789", speed: 65, lon: -87.6298, lat: 41.8781 },
    { id: 4, name: "Kenworth T680", plate: "JKL012", speed: 70, lon: -95.3698, lat: 29.7604 },
    { id: 5, name: "Mack Anthem", plate: "MNO345", speed: 62, lon: -80.1918, lat: 25.7617 },
];
