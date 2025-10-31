import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Popup } from "react-leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function GeoMaps({ center, paths = [], setPaths }) {
  const [polygonPaths, setPolygonPaths] = useState(paths);

  useEffect(() => {
    // Update local state if parent paths change
    setPolygonPaths(paths);
  }, [paths]);

  if (!center) return <div>Loading map...</div>;

  // Called when user draws a new polygon
  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer && layer.getLatLngs) {
      const latlngs = layer.getLatLngs()[0]; // assuming a single polygon
      const newPath = latlngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
      setPolygonPaths(newPath);
      setPaths(newPath); // update parent state
    }
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker at the center */}
      <Marker position={[center.lat, center.lng]}>
        <Popup>{center.displayName || "Location"}</Popup>
      </Marker>

      {/* Drawn Polygon */}
      {polygonPaths.length > 0 && (
        <Polygon pathOptions={{ color: "blue" }} positions={polygonPaths.map((p) => [p.lat, p.lng])} />
      )}

      {/* Drawing controls */}
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true,
          }}
          edit={{
            remove: true,
            edit: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
