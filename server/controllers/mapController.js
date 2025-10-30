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
