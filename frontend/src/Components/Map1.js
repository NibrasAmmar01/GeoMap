import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

export default function Map1({ id, name, map, onEdit, onDelete }) {
  const [modalView, setModalView] = useState(false);
  const navigate = useNavigate();

  const openViewModal = () => setModalView(true);
  const closeViewModal = () => setModalView(false);

  const handleConfirm = () => {
    closeViewModal();
    navigate(`/map/${name}`);
  };

  return (
    <>
      <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td>
          <button onClick={openViewModal}>View</button>
          <button onClick={() => onEdit(map)}>Edit</button>
          <button onClick={() => onDelete(id)}>Delete</button>
        </td>
      </tr>

      <Modal
        isOpen={modalView}
        onRequestClose={closeViewModal}
        ariaHideApp={false}
        className="custom-modal"
        overlayClassName="custom-overlay"
        contentLabel="View Map"
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "15px" }}>🗺️ Map Details</h2>
          <p><strong>ID:</strong> {id}</p>
          <p><strong>Name:</strong> {name}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={closeViewModal}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#aaa",
                color: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>

            <button
              onClick={handleConfirm}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#333",
                color: "white",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
