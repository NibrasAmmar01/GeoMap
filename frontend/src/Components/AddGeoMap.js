import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GeoMaps from './GeoMaps';

function AddGeoMap() {
  const btnRef = useRef();
  const { name } = useParams();
  const [mapLocation, setLocation] = useState(null);
  const history = useNavigate();
  const [mapInfo, setMapInfo] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "GeoMapApp/1.0 (nebrasammar01@gmail.com)"
            }
          }
        );
        const data = await resp.json();
        console.log(data); 
        if (data && data.length > 0) {
          setLocation({
            lat: parseFloat(data[0]?.lat),
            lng: parseFloat(data[0]?.lon),
            displayName: data[0]?.display_name || "Unknown Location",
            type: data[0]?.type || "N/A",
            category: data[0]?.class || "N/A",
            address: data[0]?.address || {},
            country: data[0]?.address?.country || "Unknown",
            boundingBox: data[0]?.boundingbox || []
          });

          const response = await axios.post("http://localhost:2000/api/getMapInfo", { name });
          console.log(response.data);
          setMapInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
      }
    };   

    if (name) fetchLocation();
  }, [name]);

  // Initialize state as object with paths array
  const [state, setState] = useState({ paths: [] });
  const paths = state.paths;

  const saveMap = () => {
    if (!paths || paths.length === 0) {
      alert("No polygon drawn!");
      return;
    }
    
    const new_path = JSON.stringify(paths);

    // Extract parentId from mapInfo
    const parentId = mapInfo?.result?.[0]?.id;
    if (!parentId) {
      alert("Cannot find the map ID for this location");
      return;
    }

    axios
      .post("http://localhost:2000/api/addMap", {
        parentid: parentId,
        coordinates: new_path,
      })
      .then((response) => {
        alert(response.data.msg || "Saved successfully");
        if (btnRef.current) {
          btnRef.current.setAttribute("disabled", "disabled");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong while saving map");
      });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <GeoMaps
        center={mapLocation}
        paths={paths}
        setPaths={(newPaths) => setState({ paths: newPaths })}
      />

      <button 
        ref={btnRef}
        onClick={saveMap}
        disabled={!paths || paths.length === 0}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          backgroundColor: paths && paths.length > 0 ? "#2196F3" : "#aaa",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: paths && paths.length > 0 ? "pointer" : "not-allowed",
          fontSize: "16px"
        }}
      >
        Save Map
      </button>
    </div>
  );
}

export default AddGeoMap;
