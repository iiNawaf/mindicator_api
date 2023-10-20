const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    await pool.query(
        "UPDATE recommendations SET status = $1 WHERE r_id = $2",
        [status, id]
    );
    
    return res.status(201).send({
        message: "Recommendation updated successfully!",
        status: status
    });
  } catch (error) {
    return res.status(400).send({
        message: "Cannot update recommendation status."
    });
  }
});

module.exports = router;
