const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to count incomplete records
        const query = `
        SELECT COUNT(*) AS youthCount FROM parish_youth_data
        WHERE is_complete=1
        `;

        // Execute the query
        const [result] = await conn.query(query);

        // Release the connection
        conn.release();

        // Return the count of incomplete records
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: { youthCount: result[0].youthCount },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            isError: true,
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
