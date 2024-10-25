const express = require("express");
const router = express.Router();
const db = require("../config/db");
const checkAuth = require("../middlewares/checkAuth");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to count incomplete records
        const query = `
        SELECT COUNT(*) AS youthCount FROM parish_youth_data
        WHERE is_complete=1 AND (is_deleted = 0 or is_deleted ='0')
        `;

        const queryGlobal = `
        SELECT COUNT(*) AS globalCount FROM parish_global_data
        WHERE is_complete=1 AND (is_deleted = 0 or is_deleted ='0')
        `;

        const queryParish = `
        SELECT COUNT(*) AS parishCount FROM parish_data
        WHERE is_complete=1 AND (is_deleted = 0 or is_deleted ='0')
        `;

        // Execute the query
        const [resultGlobal] = await conn.query(queryGlobal);
        const [result] = await conn.query(query);
        const [resultParish] = await conn.query(queryParish);

        // Release the connection
        conn.release();

        // Return the count of incomplete records
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: {
                youthCount: result[0].youthCount,
                globalMembers: resultGlobal[0].globalCount,
                parishMembers: resultParish[0].parishCount,
            },
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

router.post("/changePassword", checkAuth, async (req, res) => {
    const { OLD_PASSWORD, NEW_PASSWORD } = req.body;

    if (!OLD_PASSWORD || !NEW_PASSWORD) {
        return res.status(400).json({
            statusCode: 400,
            isError: true,
            responseData: [],
            statusText: "Validation Error",
        });
    }
    console.log(req.user);

    let conn;
    try {
        conn = await db.connection();
        await conn.beginTransaction();

        const query = "SELECT * FROM parish_login WHERE username = ?";
        const records = [req.user.username];
        const [userRows] = await conn.query(query, records);

        if (userRows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: false,
                responseData: null,
                statusText: "User Not found",
            });
        }

        const USER = userRows[0];

        // Verify the old password
        if (!bcrypt.compareSync(OLD_PASSWORD, USER.user_password)) {
            return res.status(401).json({
                statusCode: 401,
                isError: false,
                responseData: null,
                statusText: "Unauthorized - Incorrect Username or Password",
            });
        }

        // Change password
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
        const updateRecords = [
            hashedPassword,
            req.user.username, // WHERE TEACHER_ID
        ];
        const updateQuery = `
            UPDATE parish_login
            SET user_password = ?
            WHERE username = ?`;

        const [rows] = await conn.query(updateQuery, updateRecords);
        await conn.commit();

        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: rows,
            statusText: "RECORD UPDATED",
        });
    } catch (error) {
        console.error(error);
        if (conn) {
            await conn.rollback();
            await conn.release();
        }
        if (error.errno === 1062) {
            // Duplicate entry error
            return res.status(409).json({
                statusCode: 409,
                isError: false,
                responseData: null,
                statusText: error.message,
            });
        }
        send500Error(res, error);
    } finally {
        if (conn) {
            await conn.release();
        }
    }
});

router.post("/changePassword", checkAuth, async (req, res) => {
    const { OLD_PASSWORD, NEW_PASSWORD } = req.body;

    if (!OLD_PASSWORD || !NEW_PASSWORD) {
        return res.status(400).json({
            statusCode: 400,
            isError: true,
            responseData: [],
            statusText: "Validation Error",
        });
    }

    let conn;
    try {
        conn = await db.connection();
        await conn.beginTransaction();

        const query = "SELECT * FROM parish_login WHERE username = ?";
        const records = [req.user.username];
        const [userRows] = await conn.query(query, records);

        if (userRows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: false,
                responseData: null,
                statusText: "User Not found",
            });
        }

        const USER = userRows[0];

        // Verify the old password
        if (!bcrypt.compareSync(OLD_PASSWORD, USER.user_password)) {
            return res.status(401).json({
                statusCode: 401,
                isError: false,
                responseData: null,
                statusText: "Unauthorized - Incorrect Username or Password",
            });
        }

        // Change password
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
        const updateRecords = [
            hashedPassword,
            req.user.username, // WHERE TEACHER_ID
        ];
        const updateQuery = `
            UPDATE parish_login
            SET user_password = ?
            WHERE username = ?`;

        const [rows] = await conn.query(updateQuery, updateRecords);
        await conn.commit();

        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: rows,
            statusText: "RECORD UPDATED",
        });
    } catch (error) {
        console.error(error);
        if (conn) {
            await conn.rollback();
            await conn.release();
        }
        if (error.errno === 1062) {
            // Duplicate entry error
            return res.status(409).json({
                statusCode: 409,
                isError: false,
                responseData: null,
                statusText: error.message,
            });
        }
        send500Error(res, error);
    } finally {
        if (conn) {
            await conn.release();
        }
    }
});

router.post("/changeUserPassword", checkAuth, async (req, res) => {
    const { OLD_PASSWORD, NEW_PASSWORD, username } = req.body;

    if (!OLD_PASSWORD || !NEW_PASSWORD || !username) {
        return res.status(400).json({
            statusCode: 400,
            isError: true,
            responseData: [],
            statusText: "Validation Error",
        });
    }

    let conn;
    try {
        conn = await db.connection();
        await conn.beginTransaction();

        const query =
            "SELECT * FROM parish_login WHERE username = ? AND user_role != 'admin'";
        const records = [username];
        const [userRows] = await conn.query(query, records);

        if (userRows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: false,
                responseData: null,
                statusText: "User Not found",
            });
        }

        const USER = userRows[0];

        // Verify the old password
        if (!bcrypt.compareSync(OLD_PASSWORD, USER.user_password)) {
            return res.status(401).json({
                statusCode: 401,
                isError: false,
                responseData: null,
                statusText: "Unauthorized - Incorrect Username or Password",
            });
        }

        // Change password
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
        const updateRecords = [
            hashedPassword,
            username, // WHERE TEACHER_ID
        ];
        const updateQuery = `
            UPDATE parish_login
            SET user_password = ?
            WHERE username = ?`;

        const [rows] = await conn.query(updateQuery, updateRecords);
        await conn.commit();

        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: rows,
            statusText: "RECORD UPDATED",
        });
    } catch (error) {
        console.error(error);
        if (conn) {
            await conn.rollback();
            await conn.release();
        }
        if (error.errno === 1062) {
            // Duplicate entry error
            return res.status(409).json({
                statusCode: 409,
                isError: false,
                responseData: null,
                statusText: error.message,
            });
        }
        send500Error(res, error);
    } finally {
        if (conn) {
            await conn.release();
        }
    }
});

module.exports = router;
