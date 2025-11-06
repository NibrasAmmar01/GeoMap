import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GeoMaps from './GeoMaps';
import { FaSave } from 'react-icons/fa'; // Icon for save

function AddGeoMap() {
  const btnRef = useRef();
  const { name } = useParams();
  const [mapLocation, setLocation] = useState(null);
  const history = useNavigate();
  const [mapInfo, setMapInfo] = useState([]);
  const [saved, setSaved] = useState(false); // Track save status

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
          {
            headers: { "User-Agent": "GeoMapApp/1.0 (nebrasammar01@gmail.com)" }
          }
        );
        const data = await resp.json();
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
          setMapInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
      }
    };
    if (name) fetchLocation();
  }, [name]);

  const [state, setState] = useState({ paths: [] });
  const paths = state.paths;

  //console.log("mapInfo", mapInfo.data[0].id)

  const saveMap = () => {
    if (!paths || paths.length === 0) {
      alert("No polygon drawn!");
      return;
    }

    const new_path = JSON.stringify(paths);
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
        setSaved(true); // mark as saved
        if (btnRef.current) {
          btnRef.current.setAttribute("disabled", "disabled");
        }
        alert(response.data.msg || "Saved successfully");
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong while saving map");
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <GeoMaps
        center={mapLocation}
        paths={paths}
        setPaths={(newPaths) => { setState({ paths: newPaths }); setSaved(false); }}
      />

      {paths && paths.length > 0 && (
        <button
          ref={btnRef}
          onClick={saveMap}
          disabled={!paths || paths.length === 0 || saved}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 24px',
            marginTop: '15px',
            backgroundColor: saved ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: !paths || paths.length === 0 || saved ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            if (!saved && paths.length > 0) e.target.style.backgroundColor = '#1976D2';
          }}
          onMouseLeave={(e) => {
            if (!saved && paths.length > 0) e.target.style.backgroundColor = '#2196F3';
          }}
        >
          <FaSave style={{ marginRight: '8px' }} />
          {saved ? 'Saved ✅' : 'Save Map'}
        </button>
      )}
      <button
      onClick={() => history("/")}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        marginTop: '15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#5a6268')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#6c757d')}
    >
      ⬅ Go Back
    </button>
    </div>
  );
}

export default AddGeoMap;
