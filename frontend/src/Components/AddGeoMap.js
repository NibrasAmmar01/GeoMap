import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddGeoMap() {

    let {name} = useParams()
    const [mapLocation, setLocation] = useState();
    const history = useNavigate();

     useEffect(() => {
        const fetchLocation = async () => {
            try {
                const resp = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${process.env.REACT_APP_GOOGLEAPI}`
                );
                const data = await resp.json();
                console.log(data);
                setLocation(data.results);
            } catch (error) {
                console.error("Error fetching geocode:", error);
            }
        };

        if (name) fetchLocation();
    }, [name]);
    return (
        <div>

        </div>
    )
}

export default AddGeoMap