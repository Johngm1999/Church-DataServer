const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_KEY = "secret";
const REFRESH_JWT_KEY = "refreshsecret";
let refreshTokens = [];
const { validationResult } = require("express-validator");
const validator = require("./validations/validation");

router.get("/", async (req, res, next) => {
    const conn = await db.connection();
    const results = conn.execute("select 1+1");
    conn.release();
    res.status(200).json({
        statusCode: 200,
        isError: false,
        responseData: results,
        statusText: "RECORD OK",
    });
});

// login API
router.post("/login", validator.logincheck, async (req, res, next) => {
    const errors = validationResult(req);
    const { USERNAME, PASSWORD } = req.body;
    let USER;

    if (!errors.isEmpty()) {
        console.log(errors.errors);

        return res.status(400).json({
            statusCode: 400,
            isError: true,
            responseData: errors.array(),
            statusText: errors.errors[0].msg || "please check your credentials",
        });
    } else {
        // login
        const query = "SELECT * FROM parish_login where username = ?";
        const records = [USERNAME];
        try {
            let conn;
            try {
                conn = await db.connection();
            } catch (error) {
                return send500Error(res, error);
            }
            await conn.beginTransaction();
            [userRows, userFields] = await conn.query(query, records);
            USER = userRows[0];
            // console.log(USER);
            if (userRows.length > 0) {
                // console.log(USER);
                if (bcrypt.compareSync(PASSWORD, USER.user_password)) {
                    const token = generateAccessToken(USER);
                    const refreshToken = generateRefreshToken(USER);
                    refreshTokens.push(refreshToken);
                    await conn.commit();
                    await conn.release();

                    res.status(201)
                        .json({
                            statusCode: 201,
                            isError: false,
                            token: token,
                            refreshToken: refreshToken,
                            statusText: "Authenticated",
                            responseData: USER,
                        })
                        .end();
                } else {
                    await conn.rollback();
                    await conn.release();
                    res.status(400)
                        .json({
                            statusCode: 400,
                            isError: false,
                            responseData: null,
                            statusText: "INVALID USERNAME OR PASSWORD",
                        })
                        .end();
                }
            } else {
                await conn.rollback();
                await conn.release();
                res.status(400)
                    .json({
                        statusCode: 400,
                        isError: false,
                        responseData: null,
                        statusText: "INVALID USERNAME OR PASSWORD",
                    })
                    .end();
            }
        } catch (error) {
            console.log(error);
            res.status(500)
                .json({
                    statusCode: 500,
                    isError: true,
                    responseData: null,
                    statusText: "Server Error,Try Again",
                })
                .end();
        }
    }
});

// generate token using refresh token
router.post("/token", (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            res.status(403)
                .json({
                    statusCode: 403,
                    isError: false,
                    responseData: null,
                    statusText: "Unauthorized",
                })
                .end();
        } else if (!refreshTokens.includes(refreshToken)) {
            // return res.sendStatus(403);

            res.status(403)
                .json({
                    statusCode: 403,
                    isError: false,
                    responseData: null,
                    statusText: "Forbidden - Refresh Token Not Valid",
                })
                .end();
        } else {
            jwt.verify(refreshToken, REFRESH_JWT_KEY, (err, user) => {
                if (err) {
                    // return res.sendStatus(403);
                    res.status(403)
                        .json({
                            statusCode: 403,
                            isError: false,
                            responseData: null,
                            statusText: err,
                        })
                        .end();
                } else {
                    const token = generateAccessToken(user);

                    res.status(201)
                        .json({
                            statusCode: 201,
                            isError: false,
                            token: token,
                            refreshToken: refreshToken,
                            statusText: "Authenticated",
                            responseData: user,
                        })
                        .end();
                }
            });
        }
    } catch (error) {
        console.log(error);
        send500Error(res, error);
    }
});

router.post("/logout", (req, res) => {
    const { refreshToken } = req.body;
    try {
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        res.status(200).json({
            statusCode: 200,
            isError: false,
            statusText: "Logout successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                statusCode: 500,
                isError: true,
                responseData: null,
                statusText: "Server Error,Try Again",
            })
            .end();
    }
});

module.exports = router;

// function to generate token
function generateAccessToken(user) {
    // expires after half and hour (1800 seconds = 30 minutes)
    if (!user.exp) {
        return jwt.sign(user, JWT_KEY, {
            expiresIn: "1800s",
        });
    }

    return jwt.sign(user, JWT_KEY);
}

// function to generate refresh token
function generateRefreshToken(user) {
    // expires after 5 hour (18000 seconds = 5 hrs)
    return jwt.sign(user, REFRESH_JWT_KEY, {
        expiresIn: "18000s",
    });
}

function send500Error(res, error) {
    res.status(500)
        .json({
            statusCode: 500,
            isError: true,
            responseData: null,
            statusText: error.message,
        })
        .end();
}
