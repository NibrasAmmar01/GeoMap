// GeoMaps.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Popup, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export default function GeoMaps({ center, paths = [], setPaths }) {
  const [polygonPaths, setPolygonPaths] = useState(paths);

  useEffect(() => {
    setPolygonPaths(paths); // sync with parent paths
  }, [paths]);

  if (!center) return <div>Loading map...</div>;

  // Handle polygon drawing
  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer && layer.getLatLngs) {
      const latlngs = layer.getLatLngs()[0]; // single polygon
      const newPath = latlngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
      setPolygonPaths(newPath);
      setPaths(newPath); // update parent
    }
  };

  // Handle polygon edits
  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (layer.getLatLngs) {
        const latlngs = layer.getLatLngs()[0];
        const newPath = latlngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
        setPolygonPaths(newPath);
        setPaths(newPath);
      }
    });
  };

  // Handle polygon removal
  const handleDeleted = (e) => {
    setPolygonPaths([]);
    setPaths([]);
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

      {/* Marker at the center with proper icon */}
      <Marker
        position={[center.lat, center.lng]}
        icon={L.icon({
          iconUrl: markerIconPng,
          shadowUrl: markerShadowPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })}
      >
        <Popup>{center.displayName || "Location"}</Popup>
      </Marker>

      {/* Drawn polygon */}
      {polygonPaths.length > 0 && (
        <Polygon
          pathOptions={{
            color: "blue",
            fillColor: "#2196E3",
            fillOpacity: 0.5,
            weight: 2,
          }}
          positions={polygonPaths.map((p) => [p.lat, p.lng])}
        />
      )}

      {/* Drawing controls */}
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
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
