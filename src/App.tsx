import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export const App = () => {
    const [id, setId] = useState("");
    const [wkt, setWkt] = useState("");

    const fetchWkt = async () => {
        // add logic for fetching
    };

    return (
        <div className="container">
            <h1>OSM to WKT</h1>
            <h3>Enter OpenStreetMap's layer ID to fetch its WKT</h3>
            <InputText value={id} onChange={(e) => setId(e.target.value)} placeholder="OSM ID" />
            <Button label="Get layer's WKT" disabled={!id} onClick={fetchWkt} />
            {wkt && <pre>{wkt}</pre>}
        </div>
    );
};
