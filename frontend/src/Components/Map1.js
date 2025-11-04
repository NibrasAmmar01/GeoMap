import React, { useState } from "react";
import Modal from "react-modal";

export default function Map1({ id, name, map, onView, onEdit, onDelete }) {
  const [modalView, setModalView] = useState(false)
  const openViewModal = () =>{
    setModalView(true)
  }
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <button onClick={() => onView(map)}>View</button>
        <button onClick={() => onEdit(map)}>Edit</button>
        <button onClick={() => onDelete(id)}>Delete</button>
      </td>
    </tr>
  );
}
