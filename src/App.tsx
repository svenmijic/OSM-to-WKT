import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import * as osmtogeojson from "osmtogeojson";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { OverpassApiResponse } from "./models/overpassResponse";
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

type GeometryType = "node" | "way" | "relation";

export const App = () => {
    const [type, setType] = useState<GeometryType>("relation");
    const [id, setId] = useState("");
    const [layer, setLayer] = useState<any>();
    const [wkt, setWkt] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const convertToWkt = () => {
        if (!layer || !layer.geometry || !layer.geometry.coordinates) return "";
        const coords = layer.geometry.coordinates[0] as number[][];
        let result = "";
        for (let i = 0; i < coords.length; i++) {
            result += coords[i][0] + " " + coords[i][1];
            if (i !== coords.length - 1) result += ", ";
        }
        setWkt("POLYGON ((" + result + "))");
    };

    const fetchLayers = async () => {
        setLoading(true);
        setLayer(undefined);
        setWkt("");
        try {
            const res = await fetch(
                `https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%28%0A%20%20${type}%28${id}%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B%0A`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            const json: OverpassApiResponse = await res.json();
            if (json && json.elements && json.elements.length > 0) {
                const featuresCollection = osmtogeojson.default(json);
                const geoJson = featuresCollection.features.filter(
                    (x) => x.geometry.type === "Polygon"
                );
                setLayer(geoJson[0]);
            } else {
                //@ts-ignore
                toast.current.show({
                    severity: "warn",
                    summary: `No ${type} layer found with provided OSM ID`,
                });
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>&#127760;&nbsp;OSM to WKT&nbsp;&#127760;</h1>
            <div className="container">
                <section>
                    <div id="input-container">
                        <Dropdown
                            value={type}
                            options={[
                                { label: "Node", value: "node" },
                                { label: "Way", value: "way" },
                                { label: "Relation", value: "relation" },
                            ]}
                            onChange={(e) => setType(e.value)}
                        />
                        <InputText
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="OpenStreetMap's layer ID"
                        />
                        <Button
                            label="Fetch layer"
                            disabled={!id || loading}
                            loading={loading}
                            onClick={fetchLayers}
                        />
                    </div>
                    <MapContainer zoom={2} center={[0, 0]}>
                        {layer && <GeoJSON data={layer} style={{ opacity: 1, fillOpacity: 0.7 }} />}
                        <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                    </MapContainer>
                </section>
                <section>
                    <Button
                        className="p-button-success"
                        label="Get layer's WKT"
                        disabled={!layer}
                        onClick={convertToWkt}
                    />
                    {wkt && <pre>{wkt}</pre>}
                </section>
            </div>
            <Toast ref={toast} position="bottom-right" />
        </div>
    );
};
