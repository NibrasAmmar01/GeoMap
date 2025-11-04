import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

export default function Map1({ id, name, map, onEdit, onDelete }) {
  const [modalView, setModalView] = useState(false);
  const [geoInfo, setGeoInfo] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const navigate = useNavigate();

  const openViewModal = () => setModalView(true);
  const closeViewModal = () => setModalView(false);

  const handleConfirm = () => {
    closeViewModal();
    navigate(`/map/${name}`);
  };

  /** 🧩 Safely parse coordinates, even if stringified multiple times */
  const parseCoordinatesField = (raw) => {
    if (!raw) return null;
    let parsed = raw;

    // Keep trying to parse until it's no longer a stringified JSON
    for (let i = 0; i < 5; i++) {
      if (typeof parsed === "string") {
        const trimmed = parsed.trim();
        if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
          try {
            parsed = JSON.parse(trimmed);
            continue;
          } catch {
            break;
          }
        }
      }
      break;
    }

    return parsed;
  };

  /** 🧭 Fetch coordinates for a specific map ID */
  const getGeoMapInfo = async (parentId) => {
    setLoadingGeo(true);
    try {
      const response = await axios.post("http://localhost:2000/api/allGeoInfo", { parentId });
      let payload = response?.data;

      if (!payload) return setGeoInfo([]);

      if (payload.result && Array.isArray(payload.result)) payload = payload.result;

      const normalized = payload.map((item) => {
        const coordsRaw = item.coordinates ?? item.coordinatesString ?? item.coords ?? null;
        const parsedCoords = parseCoordinatesField(coordsRaw);
        return { ...item, coordinatesParsed: parsedCoords };
      });

      setGeoInfo(normalized);
    } catch (error) {
      console.error("Error fetching geo info:", error);
      setGeoInfo([]);
    } finally {
      setLoadingGeo(false);
    }
  };

  /** 🪄 Fetch geo info when modal opens */
  useEffect(() => {
    if (modalView) getGeoMapInfo(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalView, id]);

  /** 🧱 Render coordinate points as a formatted table */
  const renderPointsTable = (points) => {
    if (!Array.isArray(points) || points.length === 0)
      return <div style={{ color: "#666" }}>No points available.</div>;

    const haveLatLng = points.every((p) => p && p.lat !== undefined && p.lng !== undefined);
    if (haveLatLng) {
      return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Latitude</th>
              <th style={styles.th}>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {points.map((pt, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{idx + 1}</td>
                <td style={styles.td}>{Number(pt.lat).toFixed(6)}</td>
                <td style={styles.td}>{Number(pt.lng).toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Fallback: pretty JSON
    return <pre style={styles.coordinatesBlock}>{JSON.stringify(points, null, 2)}</pre>;
  };

  /** 🧾 Render block for one or more polygons */
  const renderCoordinatesBlock = (coords) => {
    if (!coords) return <div style={{ color: "#666" }}>No coordinates available.</div>;

    if (Array.isArray(coords)) {
      const isArrayOfArrays = coords.length > 0 && Array.isArray(coords[0]);
      if (isArrayOfArrays) {
        return (
          <div>
            {coords.map((poly, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <strong>Polygon {i + 1}</strong>
                {renderPointsTable(poly)}
              </div>
            ))}
          </div>
        );
      }
      return renderPointsTable(coords);
    }

    return <pre style={styles.coordinatesBlock}>{JSON.stringify(coords, null, 2)}</pre>;
  };

  return (
    <>
      <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td>
          <button onClick={openViewModal} style={styles.actionBtn}>View</button>
          <button onClick={() => onEdit(map)} style={{ ...styles.actionBtn, backgroundColor: "#f0ad4e" }}>Edit</button>
          <button onClick={() => onDelete(id)} style={{ ...styles.actionBtn, backgroundColor: "#d9534f" }}>Delete</button>
        </td>
      </tr>

      {/* 🪟 Modal Popup */}
      <Modal
        isOpen={modalView}
        onRequestClose={closeViewModal}
        ariaHideApp={false}
        className="custom-modal"
        overlayClassName="custom-overlay"
        contentLabel="View Map"
      >
        <div style={styles.modalContent}>
          <h2 style={{ marginBottom: 12 }}>🗺️ Map Details</h2>
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Name:</strong> {name}</p>

          <div style={{ marginTop: 16, textAlign: "left" }}>
            <h4 style={{ marginBottom: 8 }}>Coordinates</h4>
            {loadingGeo ? (
              <div style={{ color: "#666" }}>Loading coordinates…</div>
            ) : geoInfo.length === 0 ? (
              <div style={{ color: "#666" }}>No coordinates available.</div>
            ) : (
              <div style={styles.scrollArea}>
                {geoInfo.map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ marginBottom: 6 }}>
                      <strong>Record {i + 1} (parentid: {item.parentid ?? item.parentId ?? id}):</strong>
                    </div>
                    {renderCoordinatesBlock(item.coordinatesParsed ?? item.coordinates)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
            <button onClick={closeViewModal} style={{ ...styles.button, backgroundColor: "#777" }}>Close</button>
            <button onClick={handleConfirm} style={{ ...styles.button, backgroundColor: "#333" }}>Confirm</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/** 🎨 Inline Styles */
const styles = {
  modalContent: {
    padding: "22px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    maxWidth: "760px",
    width: "96%",
    margin: "auto",
    boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  scrollArea: {
    maxHeight: 340,
    overflowY: "auto",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    background: "#fbfbfb",
    wordBreak: "break-word",
  },
  coordinatesBlock: {
    fontSize: 13,
    background: "#fff",
    border: "1px solid #eee",
    padding: 10,
    borderRadius: 6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
  th: {
    textAlign: "left",
    padding: "6px 10px",
    borderBottom: "1px solid #eaeaea",
    fontWeight: 600,
    background: "#f7f7f7",
  },
  td: {
    padding: "6px 10px",
    borderBottom: "1px solid #efefef",
  },
  actionBtn: {
    marginRight: 8,
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#0d6efd",
    color: "white",
    cursor: "pointer",
  },
  button: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};
