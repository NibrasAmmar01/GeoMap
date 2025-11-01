import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const addName = () => {
    if (!name.trim()) return; // extra safety
    axios
      .post("http://localhost:2000/api/addName", { name: name.trim() })
      .then((response) => {
        if (response) {
          alert(response.data.msg);
          navigate(`/map/${name.trim()}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong while adding the location");
      });
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">🌍 GeoMap Application</h1>
        <p className="homepage-subtitle">
          Enter a location name to add it and start mapping
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Enter location..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="searchtext"
            onKeyPress={(e) => { if(e.key === 'Enter') addName(); }}
          />
          <Button
            variant="dark"
            className="searchbtn"
            disabled={!name.trim()}
            onClick={addName}
            style={{ marginLeft: "10px" }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
