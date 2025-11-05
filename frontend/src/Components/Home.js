import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map1 from "./Map1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [name, setName] = useState("");
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  // === Add new map ===
  const addName = () => {
    if (!name.trim()) {
      toast.warn("Please enter a location name first.");
      return;
    }

    axios
      .post("http://localhost:2000/api/addName", { name: name.trim() })
      .then((response) => {
        if (response && response.data.msg) {
          toast.success(response.data.msg);
          navigate(`/map/${name.trim()}`);
        } else {
          toast.success("Location added successfully!");
          navigate(`/map/${name.trim()}`);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong while adding the location.");
      });
  };

  // === Fetch all maps ===
  const getAllMaps = () => {
    axios
      .post("http://localhost:2000/api/getAllMaps")
      .then((response) => {
        if (response.data && response.data.result) {
          setMaps(response.data.result);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch maps.");
      });
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

  // === View Map ===
  const handleView = (map) => {
    navigate(`/map/${map.name}`);
  };

  // === Edit Map ===
  const handleEdit = (map) => {
    const newName = prompt("Enter new name for this map:", map.name);
    if (!newName || newName.trim() === map.name) return;

    axios
      .post("http://localhost:2000/api/editMap", {
        id: map.id,
        newName: newName.trim(),
      })
      .then((response) => {
        toast.success(response.data.msg || "Map name updated!");
        getAllMaps();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong while updating the name.");
      });
  };

  // === Delete Map ===
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      axios
        .post("http://localhost:2000/api/deleteMap", { id })
        .then((response) => {
          toast.success(response.data.msg || "Map deleted successfully!");
          getAllMaps();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while deleting the map.");
        });
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Enter location..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="searchtext"
            onKeyPress={(e) => {
              if (e.key === "Enter") addName();
            }}
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

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
