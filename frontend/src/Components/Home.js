import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map1 from "./Map1"; // ✅ Import your component

export default function Home() {
  const [name, setName] = useState("");
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const addName = () => {
    if (!name.trim()) return;

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

  const getAllMaps = () => {
    axios
      .post("http://localhost:2000/api/getAllMaps")
      .then((response) => {
        if (response.data && response.data.result) {
          setMaps(response.data.result);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    let unmounted = false;

    const timer = setTimeout(() => {
      if (!unmounted) {
        getAllMaps();
      }
    }, 500);

    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
  }, []);

  // ===== Handlers =====
  const handleView = (map) => {
    navigate(`/map/${map.name}`);
  };

  const handleEdit = (map) => {
    const newName = prompt("Enter new name for this map:", map.name);
    if (!newName || newName.trim() === map.name) return;
    
    axios
    .post("http://localhost:2000/api/editMap", { id: map.id, newName: newName.trim() })
    .then((response) => {
      alert(response.data.msg);
      getAllMaps(); // refresh table
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong while updating the name.");
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      axios
        .post("http://localhost:2000/api/deleteMap", { id })
        .then((response) => {
          alert(response.data.msg);
          getAllMaps(); // refresh table
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="homepage-container" style={{ flexDirection: "column", gap: "30px" }}>
      {/* ===== Search Panel ===== */}
      <div className="homepage-content search-panel">
        <h1 className="homepage-title">🌍 GeoMap Application</h1>
        <p className="homepage-subtitle">
          Enter a location name to add it and start mapping
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Enter location..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="searchtext"
            onKeyPress={(e) => { if (e.key === "Enter") addName(); }}
          />
          <Button
            variant="dark"
            className="searchbtn"
            disabled={!name.trim()}
            onClick={addName}
          >
            Add
          </Button>
        </div>
      </div>

      {/* ===== Table Panel ===== */}
      <div className="homepage-content table-panel">
        <h3 style={{ marginBottom: 16, textAlign: "left" }}>🗺️ Map List</h3>
        <div style={{ overflowX: "auto" }}>
          <Table
            striped
            bordered
            hover
            responsive
            className="text-center"
            style={{ minWidth: 600, borderRadius: "8px", overflow: "hidden" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>PLACE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {maps.length > 0 ? (
                maps.map((map, index) => (
                  <Map1
                    key={index}
                    id={map.id}
                    name={map.name}
                    map={map}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ color: "#666" }}>
                    No maps found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
