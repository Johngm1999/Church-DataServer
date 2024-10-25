const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middlewares/checkAuth");

router.get("/", async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data from family_information table
        const query = `
            SELECT * FROM parish_data
             WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted ='0')
            ORDER BY created_at DESC LIMIT ? OFFSET ? 
        `;
        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get the total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_data  
            WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted ='0') `;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Format the data to match the input structure
        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "PAR_" + row.id,
            formNumber: row.form_number,
            familyName: row.family_name,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            headName: row.head_name,
            headAge: row.head_age,
            headOccupation: row.head_occupation,
            member1Name: row.member1_name,
            member1Age: row.member1_age,
            member1Occupation: row.member1_occupation,
            member2Name: row.member2_name,
            member2Age: row.member2_age,
            member2Occupation: row.member2_occupation,
            member3Name: row.member3_name,
            member3Age: row.member3_age,
            member3Occupation: row.member3_occupation,
            child1Name: row.child1_name,
            child1Age: row.child1_age,
            child1Occupation: row.child1_occupation,
            child2Name: row.child2_name,
            child2Age: row.child2_age,
            child2Occupation: row.child2_occupation,
            child3Name: row.child3_name,
            child3Age: row.child3_age,
            child3Occupation: row.child3_occupation,
            child4Name: row.child3_name,
            child4Age: row.child3_age,
            child4Occupation: row.child3_occupation,
            healthConcerns: row.health_concerns,
            financialSituation: row.financial_situation,
            educationalNeeds: row.educational_needs,
            specialConcerns: row.special_concerns,
            attendingChurch: row.attending_church,
            needSacraments: row.need_sacraments,
            prayerRequests: row.prayer_requests,
            isParishWhatsappGroup: row.is_parish_whatsapp_group,
            suggestedMobile: row.suggested_mobile,
            generalObservations: row.general_observations,
            additionalInfo: row.additional_info,
            unit: row.unit,
        }));

        // Return paginated data along with total pages and current page info
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: parseInt(limit),
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

router.get("/inomplete", async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data from family_information table
        const query = `
            SELECT * FROM parish_data
             WHERE is_complete = 0 AND (is_deleted = 0 or is_deleted ='0')
            ORDER BY created_at DESC LIMIT ? OFFSET ? 
        `;
        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get the total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_data  
            WHERE is_complete = 0 AND (is_deleted = 0 or is_deleted ='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Format the data to match the input structure
        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "PAR_" + row.id,
            formNumber: row.form_number,
            familyName: row.family_name,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            headName: row.head_name,
            headAge: row.head_age,
            headOccupation: row.head_occupation,
            member1Name: row.member1_name,
            member1Age: row.member1_age,
            member1Occupation: row.member1_occupation,
            member2Name: row.member2_name,
            member2Age: row.member2_age,
            member2Occupation: row.member2_occupation,
            member3Name: row.member3_name,
            member3Age: row.member3_age,
            member3Occupation: row.member3_occupation,
            child1Name: row.child1_name,
            child1Age: row.child1_age,
            child1Occupation: row.child1_occupation,
            child2Name: row.child2_name,
            child2Age: row.child2_age,
            child2Occupation: row.child2_occupation,
            child3Name: row.child3_name,
            child3Age: row.child3_age,
            child3Occupation: row.child3_occupation,
            child4Name: row.child3_name,
            child4Age: row.child3_age,
            child4Occupation: row.child3_occupation,
            healthConcerns: row.health_concerns,
            financialSituation: row.financial_situation,
            educationalNeeds: row.educational_needs,
            specialConcerns: row.special_concerns,
            attendingChurch: row.attending_church,
            needSacraments: row.need_sacraments,
            prayerRequests: row.prayer_requests,
            isParishWhatsappGroup: row.is_parish_whatsapp_group,
            suggestedMobile: row.suggested_mobile,
            generalObservations: row.general_observations,
            additionalInfo: row.additional_info,
            unit: row.unit,
        }));

        // Return paginated data along with total pages and current page info
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: parseInt(limit),
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

router.post("/add", authenticateToken, async (req, res) => {
    const {
        formNumber,
        familyName,
        address,
        contactNumber,
        email,
        headName,
        headAge,
        headOccupation,
        member1Name,
        member1Age,
        member1Occupation,
        member2Name,
        member2Age,
        member2Occupation,
        member3Name,
        member3Age,
        member3Occupation,
        child1Name,
        child1Age,
        child1Occupation,
        child2Name,
        child2Age,
        child2Occupation,
        child3Name,
        child3Age,
        child3Occupation,
        child4Name,
        child4Age,
        child4Occupation,
        healthConcerns,
        financialSituation,
        educationalNeeds,
        specialConcerns,
        attendingChurch,
        needSacraments,
        prayerRequests,
        isParishWhatsappGroup,
        suggestedMobile,
        generalObservations,
        additionalInfo,
        unit,
    } = req.body;
    let isComplete = 1;
    try {
        const conn = await db.connection();
        const query = `INSERT INTO parish_data 
        (form_number, family_name, address, contact_number, email, head_name, head_age, head_occupation, 
        member1_name, member1_age, member1_occupation, member2_name, member2_age, member2_occupation, 
        member3_name, member3_age, member3_occupation, child1_name, child1_age, child1_occupation, 

        child2_name, child2_age, child2_occupation, child3_name, child3_age, child3_occupation, child4_name, child4_age, child4_occupation,
        health_concerns, financial_situation, educational_needs, special_concerns, attending_church, 
        need_sacraments, prayer_requests, is_parish_whatsapp_group, suggested_mobile, general_observations, 
        additional_info,data_added_by,is_complete,unit) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`;

        if (
            !formNumber ||
            !familyName ||
            !address ||
            !contactNumber ||
            // !email ||
            !headName ||
            !headAge ||
            !headOccupation
            // !member1Name ||
            // !member1Age ||
            // !member1Occupation ||
            // !member2Name ||
            // !member2Age ||
            // !member2Occupation ||
            // !member3Name ||
            // !member3Age ||
            // !member3Occupation ||
            // !child1Name ||
            // !child1Age ||
            // !child1Occupation ||
            // !child2Name ||
            // !child2Age ||
            // !child2Occupation ||
            // !child3Name ||
            // !child3Age ||
            // !child3Occupation ||
            // !healthConcerns ||
            // !financialSituation ||
            // !educationalNeeds ||
            // !specialConcerns ||
            // !attendingChurch ||
            // !needSacraments ||
            // !prayerRequests ||
            // !isParishWhatsappGroup ||
            // !suggestedMobile ||
            // !generalObservations
        ) {
            isComplete = 0;
        }

        const values = [
            formNumber,
            familyName,
            address,
            contactNumber,
            email,
            headName,
            headAge,
            headOccupation,
            member1Name,
            member1Age,
            member1Occupation,
            member2Name,
            member2Age,
            member2Occupation,
            member3Name,
            member3Age,
            member3Occupation,
            child1Name,
            child1Age,
            child1Occupation,
            child2Name,
            child2Age,
            child2Occupation,
            child3Name,
            child3Age,
            child3Occupation,
            child4Name,
            child4Age,
            child4Occupation,
            healthConcerns,
            financialSituation,
            educationalNeeds,
            specialConcerns,
            attendingChurch,
            needSacraments,
            prayerRequests,
            isParishWhatsappGroup,
            suggestedMobile,
            generalObservations,
            additionalInfo,
            req.user.user_role,
            isComplete,
            unit,
        ];

        const result = await conn.query(query, values);

        const prefixedId = `PAR_${result.insertId}`;

        conn.release();
        res.status(201).json({
            statusCode: 201,
            isError: false,
            message: "Parish registration created successfully",
            prefixedId: prefixedId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            isError: true,
            message: "Internal server error",
            error: error.message,
            errorMesaage:
                error.errno == 1062
                    ? "Form number is already added"
                    : "Something wnt wrong",
            error: error.message,
        });
    }
});

router.post("/update", authenticateToken, async (req, res) => {
    const {
        id,
        formNumber,
        familyName,
        address,
        contactNumber,
        email,
        headName,
        headAge,
        headOccupation,
        member1Name,
        member1Age,
        member1Occupation,
        member2Name,
        member2Age,
        member2Occupation,
        member3Name,
        member3Age,
        member3Occupation,
        child1Name,
        child1Age,
        child1Occupation,
        child2Name,
        child2Age,
        child2Occupation,
        child3Name,
        child3Age,
        child3Occupation,
        child4Name,
        child4Age,
        child4Occupation,
        healthConcerns,
        financialSituation,
        educationalNeeds,
        specialConcerns,
        attendingChurch,
        needSacraments,
        prayerRequests,
        isParishWhatsappGroup,
        suggestedMobile,
        generalObservations,
        additionalInfo,
        unit,
    } = req.body;

    let isComplete = 1; // Default to complete

    // Check if required fields are filled
    if (
        !formNumber ||
        !familyName ||
        !address ||
        !contactNumber ||
        !headName ||
        !headAge ||
        !headOccupation
    ) {
        isComplete = 0; // Mark as incomplete if required fields are missing
    }

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_data SET 
            form_number = ?,
            family_name = ?, 
            address = ?, 
            contact_number = ?, 
            email = ?, 
            head_name = ?, 
            head_age = ?, 
            head_occupation = ?, 
            member1_name = ?, 
            member1_age = ?, 
            member1_occupation = ?, 
            member2_name = ?, 
            member2_age = ?, 
            member2_occupation = ?, 
            member3_name = ?, 
            member3_age = ?, 
            member3_occupation = ?, 
            child1_name = ?, 
            child1_age = ?, 
            child1_occupation = ?, 
            child2_name = ?, 
            child2_age = ?, 
            child2_occupation = ?, 
            child3_name = ?, 
            child3_age = ?, 
            child3_occupation = ?, 
            child4_name = ?, 
            child4_age = ?, 
            child4_occupation = ?, 
            health_concerns = ?, 
            financial_situation = ?, 
            educational_needs = ?, 
            special_concerns = ?, 
            attending_church = ?, 
            need_sacraments = ?, 
            prayer_requests = ?, 
            is_parish_whatsapp_group = ?, 
            suggested_mobile = ?, 
            general_observations = ?, 
            additional_info = ?, 
            data_added_by = ?, 
            is_complete = ? ,
            unit = ?
        WHERE id = ?`; // Include is_complete in the update

        const values = [
            formNumber,
            familyName,
            address,
            contactNumber,
            email,
            headName,
            headAge,
            headOccupation,
            member1Name,
            member1Age,
            member1Occupation,
            member2Name,
            member2Age,
            member2Occupation,
            member3Name,
            member3Age,
            member3Occupation,
            child1Name,
            child1Age,
            child1Occupation,
            child2Name,
            child2Age,
            child2Occupation,
            child3Name,
            child3Age,
            child3Occupation,
            child4Name,
            child4Age,
            child4Occupation,
            healthConcerns,
            financialSituation,
            educationalNeeds,
            specialConcerns,
            attendingChurch,
            needSacraments,
            prayerRequests,
            isParishWhatsappGroup,
            suggestedMobile,
            generalObservations,
            additionalInfo,
            req.user.user_role, // Assume the user role is to be updated as well
            isComplete, // Include isComplete in the values
            unit,
            id, // The id is used for the WHERE clause
        ];

        const [result] = await conn.query(query, values);

        conn.release();

        // Check if any rows were affected (updated)
        if (result.affectedRows === 0) {
            return res.status(400).json({
                statusCode: 400,
                isError: true,
                message: "No record found with the provided form number.",
            });
        }

        res.status(200).json({
            statusCode: 200,
            isError: false,
            message: "Parish registration updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            isError: true,
            message: "Internal server error",
            error: error.message,
            errorMessage:
                error.errno === 1062
                    ? "Form number is already added"
                    : "Something went wrong",
        });
    }
});

router.get("/search", async (req, res) => {
    try {
        // Extract query parameters for pagination and search criteria
        const {
            page = 1,
            limit = 10,
            name,
            mobileNumber,
            unit,
            familyName,
        } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Build the base query
        let query = `SELECT * FROM parish_data WHERE 1=1`;

        // Add search conditions based on provided query parameters
        if (name) {
            query += ` AND head_name LIKE ?`;
        }
        if (mobileNumber) {
            query += ` AND contact_number LIKE ?`;
        }
        if (unit) {
            query += ` AND unit LIKE ?`;
        }
        if (familyName) {
            query += ` AND family_name LIKE ?`;
        }

        // Append pagination to the query
        query += ` AND is_complete = 1 AND (is_deleted = 0 OR is_deleted = '0') LIMIT ? OFFSET ?`;

        // Prepare parameters for the query
        const params = [];
        if (name) params.push(`%${name}%`);
        if (mobileNumber) params.push(`%${mobileNumber}%`);
        if (unit) params.push(`%${unit}%`);
        if (familyName) params.push(`%${familyName}%`);
        params.push(parseInt(limit), parseInt(offset));

        // Execute the query for paginated results
        const [rows] = await conn.query(query, params);

        // Query to get total number of records with the same search criteria
        let countQuery = `SELECT COUNT(*) AS total FROM parish_data WHERE 1=1`;

        // Add the same search conditions for counting
        if (name) {
            countQuery += ` AND head_name LIKE ?`;
        }
        if (mobileNumber) {
            countQuery += ` AND contact_number LIKE ?`;
        }
        if (unit) {
            countQuery += ` AND unit LIKE ?`;
        }
        if (familyName) {
            countQuery += ` AND family_name LIKE ?`;
        }

        countQuery += ` AND is_complete = 1 AND (is_deleted = 0 OR is_deleted = '0')`;

        const countParams = [];
        if (name) countParams.push(`%${name}%`);
        if (mobileNumber) countParams.push(`%${mobileNumber}%`);
        if (unit) countParams.push(`%${unit}%`);
        if (familyName) countParams.push(`%${familyName}%`);

        // Get the total count of records matching the search criteria
        const [countResult] = await conn.query(countQuery, countParams);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Format the data
        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "PAR_" + row.id,
            formNumber: row.form_number,
            familyName: row.family_name,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            headName: row.head_name,
            headAge: row.head_age,
            headOccupation: row.head_occupation,
            member1Name: row.member1_name,
            member1Age: row.member1_age,
            member1Occupation: row.member1_occupation,
            member2Name: row.member2_name,
            member2Age: row.member2_age,
            member2Occupation: row.member2_occupation,
            member3Name: row.member3_name,
            member3Age: row.member3_age,
            member3Occupation: row.member3_occupation,
            child1Name: row.child1_name,
            child1Age: row.child1_age,
            child1Occupation: row.child1_occupation,
            child2Name: row.child2_name,
            child2Age: row.child2_age,
            child2Occupation: row.child2_occupation,
            child3Name: row.child3_name,
            child3Age: row.child3_age,
            child3Occupation: row.child3_occupation,
            child4Name: row.child3_name,
            child4Age: row.child3_age,
            child4Occupation: row.child3_occupation,
            healthConcerns: row.health_concerns,
            financialSituation: row.financial_situation,
            educationalNeeds: row.educational_needs,
            specialConcerns: row.special_concerns,
            attendingChurch: row.attending_church,
            needSacraments: row.need_sacraments,
            prayerRequests: row.prayer_requests,
            isParishWhatsappGroup: row.is_parish_whatsapp_group,
            suggestedMobile: row.suggested_mobile,
            generalObservations: row.general_observations,
            additionalInfo: row.additional_info,
            unit: row.unit,
        }));

        // Return paginated search results along with total pages and current page info
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: parseInt(limit),
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

router.get("/incomplete-count", async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to count incomplete records
        const query = `
        SELECT COUNT(*) AS incompleteCount FROM parish_data
        WHERE is_complete=0 AND (is_deleted = 0 or is_deleted ='0')
        `;

        // Execute the query
        const [result] = await conn.query(query);

        // Release the connection
        conn.release();

        // Return the count of incomplete records
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: { incompleteCount: result[0].incompleteCount || 0 },
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

router.post("/delete", async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_data SET is_deleted = 1 WHERE id = ?`;
        const result = await conn.query(query, [id]);

        conn.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: true,
                message: "Parish registration not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            isError: false,
            message: "Parish registration deleted successfully",
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

router.get("/deletedParish", async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_data
            WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')
            LIMIT ? OFFSET ?
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_data WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "PAR_" + row.id,
            formNumber: row.form_number,
            familyName: row.family_name,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            headName: row.head_name,
            headAge: row.head_age,
            headOccupation: row.head_occupation,
            member1Name: row.member1_name,
            member1Age: row.member1_age,
            member1Occupation: row.member1_occupation,
            member2Name: row.member2_name,
            member2Age: row.member2_age,
            member2Occupation: row.member2_occupation,
            member3Name: row.member3_name,
            member3Age: row.member3_age,
            member3Occupation: row.member3_occupation,
            child1Name: row.child1_name,
            child1Age: row.child1_age,
            child1Occupation: row.child1_occupation,
            child2Name: row.child2_name,
            child2Age: row.child2_age,
            child2Occupation: row.child2_occupation,
            child3Name: row.child3_name,
            child3Age: row.child3_age,
            child3Occupation: row.child3_occupation,
            child4Name: row.child3_name,
            child4Age: row.child3_age,
            child4Occupation: row.child3_occupation,
            healthConcerns: row.health_concerns,
            financialSituation: row.financial_situation,
            educationalNeeds: row.educational_needs,
            specialConcerns: row.special_concerns,
            attendingChurch: row.attending_church,
            needSacraments: row.need_sacraments,
            prayerRequests: row.prayer_requests,
            isParishWhatsappGroup: row.is_parish_whatsapp_group,
            suggestedMobile: row.suggested_mobile,
            generalObservations: row.general_observations,
            additionalInfo: row.additional_info,
            unit: row.unit,
        }));

        // Return paginated data along with total pages and current page info
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: parseInt(limit),
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

router.post("/permanentDelete", async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `DELETE FROM parish_data WHERE id = ?`;
        const result = await conn.query(query, [id]);

        conn.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: true,
                message: "Parish registration not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            isError: false,
            message: "Parish registration deleted successfully",
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

router.post("/restoreParish", async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_data SET is_deleted = 0 WHERE id = ?`;
        const result = await conn.query(query, [id]);

        conn.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: true,
                message: "Parish registration not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            isError: false,
            message: "Parish registration deleted successfully",
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
