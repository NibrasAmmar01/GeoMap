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
  const [editModal, setEditModal] = useState({ open: false, map: null, newName: "" });
  const [deletePending, setDeletePending] = useState(null);
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
        toast.success(response.data.msg || "Location added successfully!");
        navigate(`/map/${name.trim()}`);
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
    getAllMaps();
  }, []);

  // === View Map ===
  const handleView = (map) => {
    navigate(`/map/${map.name}`);
  };

  // === Open Edit Modal ===
  const handleEdit = (map) => {
    setEditModal({ open: true, map, newName: map.name });
  };

  // === Confirm Edit ===
  const confirmEdit = async () => {
    const { map, newName } = editModal;
    if (!newName.trim() || newName === map.name) {
      setEditModal({ open: false, map: null, newName: "" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:2000/api/editMap", {
        id: map.id,
        newName: newName.trim(),
      });
      toast.success(response.data.msg || "Map name updated!");
      getAllMaps();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the name.");
    } finally {
      setEditModal({ open: false, map: null, newName: "" });
    }
  };

  // === Delete Map with confirmation toast ===
  const handleDelete = (id) => {
    setDeletePending(id);
    toast.info(
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 8px" }}>Are you sure you want to delete this map?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button
            size="sm"
            variant="danger"
            onClick={() => confirmDelete(id)}
            style={{ fontWeight: 600 }}
          >
            Yes, Delete
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.dismiss()}
            style={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const confirmDelete = async (id) => {
    toast.dismiss();
    try {
      const response = await axios.post("http://localhost:2000/api/deleteMap", { id });
      toast.success(response.data.msg || "Map deleted successfully!");
      getAllMaps();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the map.");
    } finally {
      setDeletePending(null);
    }
  };

  return (
    <div className="homepage-container" style={{ flexDirection: "column", gap: "30px" }}>
      {/* ===== Search Panel ===== */}
      <div className="homepage-content search-panel">
        <h1 className="homepage-title">🌍 GeoMap Application</h1>
        <p className="homepage-subtitle">Enter a location name to add it and start mapping</p>
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

      {/* === Edit Modal === */}
      {editModal.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            <h4>Edit Map Name</h4>
            <input
              type="text"
              value={editModal.newName}
              onChange={(e) => setEditModal({ ...editModal, newName: e.target.value })}
              style={{
                marginTop: 12,
                padding: 8,
                width: "90%",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
              <Button variant="dark" onClick={confirmEdit}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditModal({ open: false, map: null, newName: "" })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
