// GeoMaps.js
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  FeatureGroup,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Utility to compute polygon centroid
const computeCentroid = (points) => {
  if (!points || points.length === 0) return null;
  let lat = 0, lng = 0;
  points.forEach((p) => {
    lat += p.lat;
    lng += p.lng;
  });
  return { lat: lat / points.length, lng: lng / points.length };
};

// Utility to compute polygon area in square meters
const computeArea = (points) => {
  if (points.length < 3) return 0;
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6378137; // Earth radius in meters
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    area += toRad(p2.lng - p1.lng) *
      (2 + Math.sin(toRad(p1.lat)) + Math.sin(toRad(p2.lat)));
  }
  return Math.abs((area * R * R) / 2.0);
};

export default function GeoMaps({ center, paths = [], setPaths }) {
  const [polygons, setPolygons] = useState(paths || []);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    setPolygons(paths);
  }, [paths]);

  if (!center) return <div>Loading map...</div>;

  // 🟩 Handle polygon creation
  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer && layer.getLatLngs) {
      const latlngs = layer.getLatLngs()[0];
      const newPolygon = latlngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
      const updated = [...polygons, newPolygon];
      setPolygons(updated);
      setPaths(updated);
    }
  };

  // 🟦 Handle edits (updates centroid + area live)
  const handleEdited = (e) => {
    const layers = e.layers;
    const updated = [];
    layers.eachLayer((layer) => {
      const latlngs = layer.getLatLngs()[0].map((ll) => ({
        lat: ll.lat,
        lng: ll.lng,
      }));
      updated.push(latlngs);
    });
    const merged = [...polygons];
    updated.forEach((poly, idx) => (merged[idx] = poly));
    setPolygons(merged);
    setPaths(merged);
  };

  // 🟥 Handle deletion
  const handleDeleted = (e) => {
    const remaining = polygons.filter((_, i) => i !== selectedPolygonIndex);
    setPolygons(remaining);
    setPaths(remaining);
    setSelectedPolygonIndex(null);
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Central marker */}
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
        <Popup>{center.displayName || "Center Location"}</Popup>
      </Marker>

      {/* Render all polygons */}
      {polygons.map((poly, i) => {
        const centroid = computeCentroid(poly);
        const area = computeArea(poly);
        const color = i === selectedPolygonIndex ? "#F44336" : "#2196E3";

        return (
          <React.Fragment key={i}>
            <Polygon
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 2,
              }}
              positions={poly.map((p) => [p.lat, p.lng])}
              eventHandlers={{
                click: () => setSelectedPolygonIndex(i),
              }}
            >
              <Popup>
                <strong>Polygon #{i + 1}</strong>
                <br />
                Area:{" "}
                {area > 1_000_000
                  ? (area / 1_000_000).toFixed(2) + " km²"
                  : area.toFixed(0) + " m²"}
                <br />
                Vertices: {poly.length}
              </Popup>
            </Polygon>

            {/* Polygon center marker */}
            {centroid && (
              <Marker
                position={[centroid.lat, centroid.lng]}
                icon={L.icon({
                  iconUrl: markerIconPng,
                  shadowUrl: markerShadowPng,
                  iconSize: [20, 32],
                  iconAnchor: [10, 32],
                })}
              >
                <Popup>Centroid of Polygon #{i + 1}</Popup>
              </Marker>
            )}
          </React.Fragment>
        );
      })}

      {/* Drawing controls */}
      <FeatureGroup ref={featureGroupRef}>
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
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: {
                color: "#2196E3",
              },
            },
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
