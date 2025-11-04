const db = require('../db');

module.exports.addName = (req, res) => {
  const name = req.body.name;
  const checkName = "SELECT * FROM store WHERE name = ?";

  db.query(checkName, [name], (err, response) => {
    if (err) {
      console.error("Error checking name:", err);
      return res.status(500).json({ msg: "Database error while checking name." });
    }

    if (response.length > 0) {
      return res.status(422).json({ msg: "This place is already added to the list!" });
    }

    const insertQuery = "INSERT INTO store(name) VALUES(?)";
    db.query(insertQuery, [name], (err, result) => {
      if (err) {
        console.error("Error inserting name:", err);
        return res.status(500).json({ msg: "Database error while adding name." });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({ msg: "Added place successfully" });
      } else {
        return res.status(400).json({ msg: "Something went wrong" });
      }
    });
  });
};

module.exports.mapInfo = (req, res)=>{
  const name = req.body.name
  const sql = "SELECT * FROM store WHERE name=?"
  db.query(sql, [name], (err, result) => {
    if(err){
      console.error(err);
      return res.status(500).json({ msg: "Database error" });
    }
    res.status(200).json({ result });
  })


}


module.exports.addMap = (req, res) => {
  const parentId = req.body.parentid;
  const coordinates = req.body.coordinates;

  if (!parentId || !coordinates) {
    return res.status(400).json({ msg: "Missing parentId or coordinates" });
  }

  // Optional: check if map already exists
  const checkSql = "SELECT * FROM store2 WHERE parentId = ? AND coordinates = ?";
  db.query(checkSql, [parentId, coordinates], (err, result) => {
    if (err) return res.status(500).json({ msg: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ msg: "Something Went Wrong" });
    }

    // Insert
    const sqlQuery = "INSERT INTO store2 (parentid, coordinates) VALUES (?, ?)";
    db.query(sqlQuery, [parentId, coordinates], (err, result) => {
      if (err) return res.status(500).json({ msg: "Database error while inserting map" });

      return res.status(200).json({ msg: "Polygon added successfully" });
    });
  });
};


module.exports.getAllMaps = (req, res) => {
  const selectsql = "SELECT * FROM store";

  db.query(selectsql, (err, result) => {
    if (err) {
      return res.status(400).json({ msg: "Something went wrong", error: err });
    }
    return res.status(200).json({ result });
  });
};


module.exports.deleteMap = (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ msg: "Missing map ID" });
  }

  // Step 1: Check if the map exists in `store`
  const checkSql = "SELECT * FROM store WHERE id = ?";
  db.query(checkSql, [id], (err, result) => {
    if (err) {
      console.error("Error checking map:", err);
      return res.status(500).json({ msg: "Database error while checking map" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "Map not found" });
    }

    // Step 2: Delete related entries in `store2`
    const deleteStore2Sql = "DELETE FROM store2 WHERE parentid = ?";
    db.query(deleteStore2Sql, [id], (err) => {
      if (err) {
        console.error("Error deleting related polygons:", err);
        return res.status(500).json({ msg: "Error deleting related polygons" });
      }

      // Step 3: Delete the main record from `store`
      const deleteStoreSql = "DELETE FROM store WHERE id = ?";
      db.query(deleteStoreSql, [id], (err, result2) => {
        if (err) {
          console.error("Error deleting map:", err);
          return res.status(500).json({ msg: "Error deleting map" });
        }

        if (result2.affectedRows > 0) {
          return res.status(200).json({ msg: "Map and related polygons deleted successfully" });
        } else {
          return res.status(400).json({ msg: "Failed to delete map" });
        }
      });
    });
  });
};


module.exports.editMap = (req, res) => {
  const { id, newName } = req.body;

  if (!id || !newName) {
    return res.status(400).json({ msg: "Missing ID or new name." });
  }

  // Step 1: Check if the new name already exists
  const checkSql = "SELECT * FROM store WHERE name = ?";
  db.query(checkSql, [newName], (err, checkResult) => {
    if (err) {
      console.error("Error checking name:", err);
      return res.status(500).json({ msg: "Database error while checking name." });
    }

    if (checkResult.length > 0) {
      return res.status(422).json({ msg: "This name already exists in the list." });
    }

    // Step 2: Update in `store`
    const updateStoreSql = "UPDATE store SET name = ? WHERE id = ?";
    db.query(updateStoreSql, [newName, id], (err, result) => {
      if (err) {
        console.error("Error updating store:", err);
        return res.status(500).json({ msg: "Database error while updating store." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Map not found." });
      }

      // Step 3: Update in `store2` (maintain consistency)
      const updateStore2Sql = "UPDATE store2 SET parentid = ? WHERE parentid = ?";
      db.query(updateStore2Sql, [newName, result.insertId || id], (err2) => {
        if (err2) {
          console.error("Error updating store2:", err2);
          return res.status(500).json({ msg: "Error updating related maps." });
        }

        return res.status(200).json({ msg: "Map updated successfully." });
      });
    });
  });
};


module.exports.getGeoMapInfo = (req, res) => {
  const { parentId } = req.body;

  if (!parentId) {
    return res.status(400).json({ msg: "Missing parentId" });
  }

  const sqlQuery = "SELECT parentId, coordinates FROM store2 WHERE parentId = ?";

  db.query(sqlQuery, [parentId], (err, result) => {
    if (err) {
      console.error("Error fetching geo info:", err);
      return res.status(500).json({ msg: "Database error while fetching geo info" });
    }

    if (result.length === 0) {
      return res.status(200).json([]);
    }

    // ✅ Parse only if coordinates is a string
    const parsedResult = result.map((item) => {
      let coords = item.coordinates;

      if (typeof coords === "string") {
        try {
          for (let i = 0; i < 3; i++) {
            if (typeof coords === "string") coords = JSON.parse(coords);
            else break;
          }
        } catch (e) {
          console.warn(`Invalid coordinates for parentId ${item.parentId}:`, coords);
        }
      }

      return { ...item, coordinates: coords };
    });

    return res.status(200).json(parsedResult);
  });
};

