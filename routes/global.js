const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middlewares/checkAuth");

router.get("/", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_global_data
            WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted = '0')
            ORDER BY created_at DESC LIMIT ? OFFSET ? 
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_global_data WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted = '0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "GLOB_" + row.id,
            formNumber: row.form_number,
            houseName: row.house_name,
            baptismName: row.baptism_name,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            contactNumber: row.contact_number,
            additionalInfo: row.additional_info,
            whatsAppNumber: row.whatsapp_number,
            email: row.email,
            country: row.country_of_residence,
            city: row.city,
            streetAddress: row.street_address,
            postalCode: row.postal_code,
            contactNumberAbroad: row.contact_number_abroad,
            whatsAppNumberAbroad: row.whatsapp_number_abroad,
            emailAbroad: row.email_abroad,
            spouseName: row.spouse_name,
            childrenNames: row.children_names,
            contactsOfFamily: row.contacts_of_family,
            ocupationOrField: row.occupation_or_field,
            currentEmployerOrInstitution: row.current_employer_or_institution,
            hasAffiliatedWithAnyChurch: row.has_affiliated_with_any_church,
            nameOfChurchAffiliated: row.name_of_church_affiliated,
            hasChanceForSundayMass: row.has_chance_for_sunday_mass,
            contactInfoParishPriest: row.contact_info_parish_priest,
            unit: row.unit,
            dataAddedBy: row.data_added_by,
            maritialStatus: row.maritial_status,
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

router.get("/inomplete", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_global_data
            WHERE is_complete = 0 AND (is_deleted = 0 or is_deleted = '0')
            ORDER BY created_at DESC LIMIT ? OFFSET ? 
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_global_data WHERE is_complete = 0 AND (is_deleted = 0 or is_deleted = '0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "GLOB_" + row.id,
            formNumber: row.form_number,
            houseName: row.house_name,
            baptismName: row.baptism_name,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            contactNumber: row.contact_number,
            additionalInfo: row.additional_info,
            whatsAppNumber: row.whatsapp_number,
            email: row.email,
            country: row.country_of_residence,
            city: row.city,
            streetAddress: row.street_address,
            postalCode: row.postal_code,
            contactNumberAbroad: row.contact_number_abroad,
            whatsAppNumberAbroad: row.whatsapp_number_abroad,
            emailAbroad: row.email_abroad,
            spouseName: row.spouse_name,
            childrenNames: row.children_names,
            contactsOfFamily: row.contacts_of_family,
            ocupationOrField: row.occupation_or_field,
            currentEmployerOrInstitution: row.current_employer_or_institution,
            hasAffiliatedWithAnyChurch: row.has_affiliated_with_any_church,
            nameOfChurchAffiliated: row.name_of_church_affiliated,
            hasChanceForSundayMass: row.has_chance_for_sunday_mass,
            contactInfoParishPriest: row.contact_info_parish_priest,
            unit: row.unit,
            dataAddedBy: row.data_added_by,
            maritialStatus: row.maritial_status,
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
    // Destructure form data from request body
    const {
        formNumber,
        baptismName,
        houseName,
        fullName,
        dateOfBirth,
        age,
        contactNumber,
        additionalInfo,
        whatsAppNumber,
        email,
        country,
        city,
        streetAddress,
        postalCode,
        contactNumberAbroad,
        whatsAppNumberAbroad,
        emailAbroad,
        spouseName,
        childrenNames,
        contacsOfFamily,
        ocupationOrField,
        currentEmployerOrInstitution,
        hasAffiliatedWithAnyChurch,
        nameOfChurchAffiliated,
        hasChanceForSundayMass,
        contactInfoParishPriest,
        unit,
        maritialStatus,
    } = req.body;

    let isComplete = 1; // Default to complete

    // Check for empty fields and conditions for parishActivity and organisationGroup
    if (
        !formNumber ||
        !baptismName ||
        !fullName ||
        !dateOfBirth ||
        !houseName ||
        !age ||
        !contactNumber ||
        !whatsAppNumber ||
        !email ||
        !country ||
        !city ||
        // !streetAddress ||
        !postalCode ||
        !contactNumberAbroad ||
        !whatsAppNumberAbroad ||
        // !emailAbroad ||
        // spouseName||
        // childrenNames||
        // !contacsOfFamily||
        !ocupationOrField ||
        // !currentEmployerOrInstitution ||
        !hasAffiliatedWithAnyChurch ||
        (hasAffiliatedWithAnyChurch == "yes" && !nameOfChurchAffiliated) ||
        !hasChanceForSundayMass ||
        !unit ||
        !maritialStatus
    ) {
        isComplete = 0;
    }

    try {
        const conn = await db.connection();
        const sql = `INSERT INTO parish_global_data (
        form_number, baptism_name,house_name, full_name, date_of_birth, age, contact_number, additional_info, whatsapp_number, email,
        country_of_residence, city, street_address, postal_code, contact_number_abroad, whatsapp_number_abroad, email_abroad,
        spouse_name, children_names, contacts_of_family, occupation_or_field, current_employer_or_institution,
        has_affiliated_with_any_church, name_of_church_affiliated, has_chance_for_sunday_mass, contact_info_parish_priest, unit,data_added_by,is_complete,maritial_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

        const values = [
            formNumber,
            baptismName,
            houseName,
            fullName,
            dateOfBirth,
            age,
            contactNumber,
            additionalInfo,
            whatsAppNumber,
            email,
            country,
            city,
            streetAddress,
            postalCode,
            contactNumberAbroad,
            whatsAppNumberAbroad,
            emailAbroad,
            spouseName,
            childrenNames,
            contacsOfFamily,
            ocupationOrField,
            currentEmployerOrInstitution,
            hasAffiliatedWithAnyChurch,
            nameOfChurchAffiliated,
            hasChanceForSundayMass,
            contactInfoParishPriest,
            unit,
            req.user.user_role,
            isComplete,
            maritialStatus,
        ];

        const result = await conn.query(sql, values);

        const prefixedId = `GLOB_${result.insertId}`;

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
    // Destructure form data from request body
    const {
        id, // ID provided in the body to identify the record
        formNumber,
        houseName,
        baptismName,
        fullName,
        dateOfBirth,
        age,
        contactNumber,
        additionalInfo,
        whatsAppNumber,
        email,
        country,
        city,
        streetAddress,
        postalCode,
        contactNumberAbroad,
        whatsAppNumberAbroad,
        spouseName,
        childrenNames,
        contacsOfFamily,
        ocupationOrField,
        hasAffiliatedWithAnyChurch,
        nameOfChurchAffiliated,
        hasChanceForSundayMass,
        contactInfoParishPriest,
        unit,
        maritialStatus,
        emailAbroad,
        currentEmployerOrInstitution,
    } = req.body;

    let isComplete = 1; // Default to complete

    // Check for empty fields and conditions for parishActivity and organisationGroup
    if (
        !formNumber ||
        !baptismName ||
        !fullName ||
        !houseName ||
        !dateOfBirth ||
        !age ||
        !contactNumber ||
        !whatsAppNumber ||
        !email ||
        !country ||
        !city ||
        !postalCode ||
        !contactNumberAbroad ||
        !whatsAppNumberAbroad ||
        !ocupationOrField ||
        !hasAffiliatedWithAnyChurch ||
        (hasAffiliatedWithAnyChurch == "yes" && !nameOfChurchAffiliated) ||
        !hasChanceForSundayMass ||
        !unit ||
        !maritialStatus
    ) {
        isComplete = 0;
    }

    try {
        const conn = await db.connection();
        const sql = `UPDATE parish_global_data SET
        form_number = ?, baptism_name = ?,house_name = ?, full_name = ?, date_of_birth = ?, age = ?, contact_number = ?, additional_info = ?, whatsapp_number = ?, email = ?, 
        country_of_residence = ?, city = ?, street_address = ?, postal_code = ?, contact_number_abroad = ?, whatsapp_number_abroad = ?, email_abroad = ?, 
        spouse_name = ?, children_names = ?, contacts_of_family = ?, occupation_or_field = ?, current_employer_or_institution = ?, 
        has_affiliated_with_any_church = ?, name_of_church_affiliated = ?, has_chance_for_sunday_mass = ?, contact_info_parish_priest = ?, unit = ?, 
        data_added_by = ?, is_complete = ? , maritial_status=? WHERE id = ?`;

        const values = [
            formNumber,
            baptismName,
            houseName,
            fullName,
            dateOfBirth,
            age,
            contactNumber,
            additionalInfo,
            whatsAppNumber,
            email,
            country,
            city,
            streetAddress,
            postalCode,
            contactNumberAbroad,
            whatsAppNumberAbroad,
            emailAbroad,
            spouseName,
            childrenNames,
            contacsOfFamily,
            ocupationOrField,
            currentEmployerOrInstitution,
            hasAffiliatedWithAnyChurch,
            nameOfChurchAffiliated,
            hasChanceForSundayMass,
            contactInfoParishPriest,
            unit,
            req.user.user_role,
            isComplete,
            maritialStatus,
            id, // Pass the ID as the last value for the WHERE clause
        ];

        const result = await conn.query(sql, values);

        conn.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: true,
                message: "No record found with the provided ID",
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
        });
    }
});

router.get("/incomplete-count", authenticateToken, async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to count incomplete records
        const query = `
        SELECT COUNT(*) AS incompleteCount FROM parish_global_data
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

router.get("/search", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination and search criteria
        const {
            page = 1,
            limit,
            name,
            dobFrom,
            dobTo,
            mobileNumber,
            unit,
            country,
            maritialStatus,
        } = req.query;
        let fullName = name;
        // Calculate the offset
        const offset = limit ? (page - 1) * limit : 0;

        // Connect to the database
        const conn = await db.connection();

        // Build the base query
        let query = `SELECT * FROM parish_global_data WHERE 1=1`;

        // Add search conditions based on provided query parameters
        if (fullName) {
            query += ` AND full_name LIKE ?`;
        }
        if (dobFrom && dobTo) {
            query += ` AND date_of_birth BETWEEN ? AND ?`;
        }
        if (mobileNumber) {
            query += ` AND mobile_number = ?`;
        }
        if (unit) {
            query += ` AND unit LIKE ?`;
        }
        if (country) {
            query += ` AND country_of_residence LIKE ?`;
        }
        if (maritialStatus) {
            query += ` AND maritial_status LIKE ?`;
        }

        if (limit) {
            query += ` AND is_complete = 1 AND (is_deleted = 0 or is_deleted = '0') LIMIT ? OFFSET ?`;
        } else {
            query += ` AND is_complete = 1 AND (is_deleted = 0 or is_deleted = '0')`;
        }

        // Prepare parameters for the query
        const params = [];
        if (fullName) params.push(`%${fullName}%`);
        if (dobFrom && dobTo) params.push(dobFrom, dobTo);
        if (mobileNumber) params.push(mobileNumber);
        if (unit) params.push(`%${unit}%`);
        if (country) params.push(`%${country}%`);
        if (maritialStatus) params.push(maritialStatus);
        if (limit) {
            params.push(parseInt(limit), parseInt(offset));
        }

        // Execute the query for paginated results
        const [rows] = await conn.query(query, params);

        // Query to get total number of records matching the same search criteria
        let countQuery = `SELECT COUNT(*) AS total FROM parish_global_data WHERE 1=1`;

        // Add the same search conditions for counting
        if (fullName) {
            countQuery += ` AND full_name LIKE ?`;
        }
        if (dobFrom && dobTo) {
            countQuery += ` AND date_of_birth BETWEEN ? AND ?`;
        }
        if (mobileNumber) {
            countQuery += ` AND mobile_number = ?`;
        }
        if (unit) {
            countQuery += ` AND unit LIKE ?`;
        }
        if (country) {
            countQuery += ` AND country_of_residence LIKE ?`;
        }
        if (maritialStatus) {
            countQuery += ` AND maritial_status = ?`;
        }

        countQuery += ` AND is_complete = 1 AND (is_deleted = 0 or is_deleted = '0')`;

        const countParams = [];
        if (fullName) countParams.push(`%${fullName}%`);
        if (dobFrom && dobTo) countParams.push(dobFrom, dobTo);
        if (mobileNumber) countParams.push(mobileNumber);
        if (unit) countParams.push(`%${unit}%`);
        if (country) countParams.push(`%${country}%`);
        if (maritialStatus) countParams.push(maritialStatus);

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
            prefixedId: "GLOB_" + row.id,
            formNumber: row.form_number,
            houseName: row.house_name,
            baptismName: row.baptism_name,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            contactNumber: row.contact_number,
            additionalInfo: row.additional_info,
            whatsAppNumber: row.whatsapp_number,
            email: row.email,
            country: row.country_of_residence,
            city: row.city,
            streetAddress: row.street_address,
            postalCode: row.postal_code,
            contactNumberAbroad: row.contact_number_abroad,
            whatsAppNumberAbroad: row.whatsapp_number_abroad,
            emailAbroad: row.email_abroad,
            spouseName: row.spouse_name,
            childrenNames: row.children_names,
            contactsOfFamily: row.contacts_of_family,
            ocupationOrField: row.occupation_or_field,
            currentEmployerOrInstitution: row.current_employer_or_institution,
            hasAffiliatedWithAnyChurch: row.has_affiliated_with_any_church,
            nameOfChurchAffiliated: row.name_of_church_affiliated,
            hasChanceForSundayMass: row.has_chance_for_sunday_mass,
            contactInfoParishPriest: row.contact_info_parish_priest,
            unit: row.unit,
            dataAddedBy: row.data_added_by,
            maritialStatus: row.maritial_status,
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

router.post("/delete", authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_global_data SET is_deleted = 1 WHERE id = ?`;
        const result = await conn.query(query, [id]);

        conn.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                isError: true,
                message: "Parish Global registration not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            isError: false,
            message: "Parish Global registration deleted successfully",
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

router.get("/deletedGlobal", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_global_data
            WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')
            LIMIT ? OFFSET ?
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_global_data WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "GLOB_" + row.id,
            formNumber: row.form_number,
            houseName: row.house_name,
            baptismName: row.baptism_name,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            contactNumber: row.contact_number,
            additionalInfo: row.additional_info,
            whatsAppNumber: row.whatsapp_number,
            email: row.email,
            country: row.country_of_residence,
            city: row.city,
            streetAddress: row.street_address,
            postalCode: row.postal_code,
            contactNumberAbroad: row.contact_number_abroad,
            whatsAppNumberAbroad: row.whatsapp_number_abroad,
            emailAbroad: row.email_abroad,
            spouseName: row.spouse_name,
            childrenNames: row.children_names,
            contactsOfFamily: row.contacts_of_family,
            ocupationOrField: row.occupation_or_field,
            currentEmployerOrInstitution: row.current_employer_or_institution,
            hasAffiliatedWithAnyChurch: row.has_affiliated_with_any_church,
            nameOfChurchAffiliated: row.name_of_church_affiliated,
            hasChanceForSundayMass: row.has_chance_for_sunday_mass,
            contactInfoParishPriest: row.contact_info_parish_priest,
            unit: row.unit,
            dataAddedBy: row.data_added_by,
            maritialStatus: row.maritial_status,
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

router.post("/permanentDelete", authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `DELETE FROM parish_global_data WHERE id = ?`;
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

router.post("/restoreGlobal", authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_global_data SET is_deleted = 0 WHERE id = ?`;
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

router.get("/getDataForExcel", authenticateToken, async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_global_data
            WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted = '0')
            ORDER BY created_at DESC 
        `;

        const [rows] = await conn.query(query);

        // Release the connection
        conn.release();

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "GLOB_" + row.id,
            formNumber: row.form_number,
            houseName: row.house_name,
            baptismName: row.baptism_name,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            contactNumber: row.contact_number,
            additionalInfo: row.additional_info,
            whatsAppNumber: row.whatsapp_number,
            email: row.email,
            country: row.country_of_residence,
            city: row.city,
            streetAddress: row.street_address,
            postalCode: row.postal_code,
            contactNumberAbroad: row.contact_number_abroad,
            whatsAppNumberAbroad: row.whatsapp_number_abroad,
            emailAbroad: row.email_abroad,
            spouseName: row.spouse_name,
            childrenNames: row.children_names,
            contactsOfFamily: row.contacts_of_family,
            ocupationOrField: row.occupation_or_field,
            currentEmployerOrInstitution: row.current_employer_or_institution,
            hasAffiliatedWithAnyChurch: row.has_affiliated_with_any_church,
            nameOfChurchAffiliated: row.name_of_church_affiliated,
            hasChanceForSundayMass: row.has_chance_for_sunday_mass,
            contactInfoParishPriest: row.contact_info_parish_priest,
            unit: row.unit,
            dataAddedBy: row.data_added_by,
            maritialStatus: row.maritial_status,
        }));

        // Return paginated data along with total pages and current page info
        res.status(200).json({
            statusCode: 200,
            isError: false,
            responseData: formattedData,
            pagination: {
                currentPage: 0,
                totalPages: 0,
                totalRecords: 0,
                limit: 0,
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
module.exports = router;
