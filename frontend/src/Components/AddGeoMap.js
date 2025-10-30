import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function AddGeoMap() {
  const { name } = useParams();
  const [mapLocation, setLocation] = useState(null);
  const history = useNavigate();
  const [mapInfo, setMapInfo] = useState([])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "GeoMapApp/1.0 (nebrasammar01@gmail.com)" // required by Nominatim
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
        setMapInfo(response.data)

        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
      }
    };   

    if (name) fetchLocation();
  }, [name]);

  return (
    <div>

    </div>
  );
}   

export default AddGeoMap;
