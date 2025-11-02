import React from "react";

export default function Map1({ id, name, map, onView, onEdit, onDelete }) {
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
