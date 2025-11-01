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
