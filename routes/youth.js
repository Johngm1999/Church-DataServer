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
            SELECT * FROM parish_youth_data
            WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted ='0')
            ORDER BY created_at DESC LIMIT ? OFFSET ? 
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_youth_data WHERE is_complete = 1 AND (is_deleted = 0 or is_deleted ='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "YTH_" + row.id,
            formNumber: row.form_number,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            gender: row.gender,
            permanentAddress: row.permanent_address,
            currentAddress: row.current_address,
            mobileNumber: row.mobile_number,
            whatsappNumber: row.whatsapp_number,
            email: row.email,
            educationalQualification: row.educational_qualification,
            currentOccupation: row.current_occupation,
            professionalDetails: row.professional_details,
            currentCourse: row.current_course,
            sacraments: {
                baptism: row.baptism,
                confirmation: row.confirmation,
                holyCommunion: row.holy_communion,
            },
            pendingSacraments: row.pending_sacraments,
            hasOrganisationGroup: row.has_organisation_group,
            organisationGroup: row.organisation_group,
            hasParishActivity: row.has_parish_activity,
            parishActivity: row.parish_activity,
            isOutsideParish: row.is_outside_parish,
            isStudent: row.is_student,
            countryCity: row.country_city,
            parishContact: row.parish_contact,
            residentialAddress: row.residential_address,
            isAttendingSundayMass: row.is_attending_sunday_mass,
            sundayMassLocation: row.sunday_mass_location,
            houseName: row.house_name,
            parentsName: row.parents_name,
            parentsNumber: row.parents_number,
            unit: row.unit,
            specials: row.specials,
            healthIssues: row.health_issues,
            additionalInfo: row.additional_info,
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

// Create a new parish registration
router.post("/add", authenticateToken, async (req, res) => {
    const {
        formNumber,
        fullName,
        dateOfBirth,
        age,
        gender,
        permanentAddress,
        currentAddress,
        mobileNumber,
        whatsappNumber,
        email,
        educationalQualification,
        currentOccupation,
        professionalDetails,
        currentCourse,
        sacraments,
        pendingSacraments,
        hasOrganisationGroup,
        organisationGroup,
        hasParishActivity,
        parishActivity,
        isOutsideParish,
        isStudent,
        countryCity,
        parishContact,
        residentialAddress,
        isAttendingSundayMass,
        sundayMassLocation,
        houseName,
        parentsName,
        parentsNumber,
        unit,
        specials,
        healthIssues,
        additionalInfo,
    } = req.body;

    // Destructure sacraments for easier access
    const { baptism, confirmation, holyCommunion } = sacraments;

    let isComplete = 1; // Default to complete

    // Check for empty fields and conditions for parishActivity and organisationGroup
    if (
        formNumber === "" ||
        fullName === "" ||
        dateOfBirth === "" ||
        age === null ||
        age === "" ||
        gender === null ||
        gender === "" ||
        permanentAddress === "" ||
        // currentAddress === "" ||
        mobileNumber === "" ||
        whatsappNumber === "" ||
        // email === "" ||
        educationalQualification === "" ||
        currentOccupation === "" ||
        professionalDetails === "" ||
        // currentCourse === "" ||
        (hasOrganisationGroup === "yes" && organisationGroup === "") ||
        (hasParishActivity === "yes" && parishActivity === "") ||
        // countryCity === "" ||
        // parishContact === "" ||
        // residentialAddress === "" ||
        // (isAttendingSundayMass === "yes" && sundayMassLocation === "") ||
        houseName === "" ||
        parentsName === "" ||
        parentsNumber === "" ||
        unit === "" ||
        (!baptism && !confirmation && !holyCommunion)
        // specials === "" ||
        // healthIssues === ""
    ) {
        isComplete = 0; // Set to incomplete if any condition is met
    }

    try {
        const conn = await db.connection();
        const query = `
            INSERT INTO parish_youth_data (
                form_number,full_name, date_of_birth, age, gender, permanent_address, current_address, mobile_number, whatsapp_number,
                email, educational_qualification, current_occupation, professional_details, current_course,
                baptism, confirmation, holy_communion, pending_sacraments, has_organisation_group, organisation_group,
                has_parish_activity, parish_activity, is_outside_parish, is_student, country_city, parish_contact,
                residential_address, is_attending_sunday_mass, sunday_mass_location, house_name,
                parents_name, parents_number, unit, specials, health_issues ,is_complete,additional_info,data_added_by
            ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?,?,?,?)
        `;
        const result = await conn.query(query, [
            formNumber,
            fullName,
            dateOfBirth,
            age,
            gender,
            permanentAddress,
            currentAddress,
            mobileNumber,
            whatsappNumber,
            email,
            educationalQualification,
            currentOccupation,
            professionalDetails,
            currentCourse,
            baptism,
            confirmation,
            holyCommunion,
            pendingSacraments,
            hasOrganisationGroup,
            organisationGroup,
            hasParishActivity,
            parishActivity,
            isOutsideParish,
            isStudent,
            countryCity,
            parishContact,
            residentialAddress,
            isAttendingSundayMass,
            sundayMassLocation,
            houseName,
            parentsName,
            parentsNumber,
            unit,
            specials,
            healthIssues,
            isComplete,
            additionalInfo,
            req.user.user_role,
        ]);

        // Return the generated prefixed ID
        const prefixedId = `YTH_${result.insertId}`;

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
        fullName,
        dateOfBirth,
        age,
        gender,
        permanentAddress,
        currentAddress,
        mobileNumber,
        whatsappNumber,
        email,
        educationalQualification,
        currentOccupation,
        professionalDetails,
        currentCourse,
        sacraments,
        pendingSacraments,
        hasOrganisationGroup,
        organisationGroup,
        hasParishActivity,
        parishActivity,
        isOutsideParish,
        isStudent,
        countryCity,
        parishContact,
        residentialAddress,
        isAttendingSundayMass,
        sundayMassLocation,
        houseName,
        parentsName,
        parentsNumber,
        unit,
        specials,
        healthIssues,
        additionalInfo,
    } = req.body;

    const { baptism, confirmation, holyCommunion } = sacraments;

    let isComplete = 1; // Default to complete

    // Check for empty fields and conditions for parishActivity and organisationGroup
    if (
        formNumber === "" ||
        fullName === "" ||
        dateOfBirth === "" ||
        age === null ||
        age === "" ||
        gender === null ||
        gender === "" ||
        permanentAddress === "" ||
        // currentAddress === "" ||
        mobileNumber === "" ||
        whatsappNumber === "" ||
        // email === "" ||
        educationalQualification === "" ||
        currentOccupation === "" ||
        professionalDetails === "" ||
        // currentCourse === "" ||
        (hasOrganisationGroup === "yes" && organisationGroup === "") ||
        (hasParishActivity === "yes" && parishActivity === "") ||
        // countryCity === "" ||
        // parishContact === "" ||
        // residentialAddress === "" ||
        // (isAttendingSundayMass === "yes" && sundayMassLocation === "") ||
        houseName === "" ||
        parentsName === "" ||
        parentsNumber === "" ||
        unit === "" ||
        (!baptism && !confirmation && !holyCommunion)
        // specials === "" ||
        // healthIssues === ""
    ) {
        isComplete = 0; // Set to incomplete if any condition is met
    }

    try {
        const conn = await db.connection();
        const query = `
            UPDATE parish_youth_data 
            SET form_number=?,full_name = ?, date_of_birth = ?, age = ?, gender = ?, permanent_address = ?, 
                current_address = ?, mobile_number = ?, whatsapp_number = ?, email = ?, 
                educational_qualification = ?, current_occupation = ?, professional_details = ?, 
                current_course = ?, baptism = ?, confirmation = ?, holy_communion = ?, pending_sacraments=?,
                has_organisation_group = ?, organisation_group = ?, has_parish_activity = ?, 
                parish_activity = ?, is_outside_parish = ?, is_student = ?, country_city = ?, 
                parish_contact = ?, residential_address = ?, is_attending_sunday_mass = ?, 
                sunday_mass_location = ?, house_name = ?, parents_name = ?, parents_number = ?, 
                unit = ?, specials = ?, health_issues = ? ,is_complete = ? , additional_info=?
            WHERE id = ?
        `;
        const result = await conn.query(query, [
            formNumber,
            fullName,
            dateOfBirth,
            age,
            gender,
            permanentAddress,
            currentAddress,
            mobileNumber,
            whatsappNumber,
            email,
            educationalQualification,
            currentOccupation,
            professionalDetails,
            currentCourse,
            baptism,
            confirmation,
            holyCommunion,
            pendingSacraments,
            hasOrganisationGroup,
            organisationGroup,
            hasParishActivity,
            parishActivity,
            isOutsideParish,
            isStudent,
            countryCity,
            parishContact,
            residentialAddress,
            isAttendingSundayMass,
            sundayMassLocation,
            houseName,
            parentsName,
            parentsNumber,
            unit,
            specials,
            healthIssues,
            isComplete,
            additionalInfo,
            id,
        ]);

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
            message: "Parish registration updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            isError: true,
            message: "Internal server error",
            errorMesaage:
                error.errno == 1062
                    ? "Form number is already added"
                    : "Something wnt wrong",
            error: error.message,
        });
    }
});

router.post("/delete", authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_youth_data SET is_deleted = 1 WHERE id = ?`;
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

router.get("/inomplete", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `SELECT * FROM parish_youth_data
                        WHERE is_complete=0 AND (is_deleted = 0 or is_deleted ='0')
                        ORDER BY created_at DESC LIMIT ? OFFSET ?
                        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_youth_data WHERE is_complete=0 AND (is_deleted = 0 or is_deleted ='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "YTH_" + row.id,
            formNumber: row.form_number,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            gender: row.gender,
            permanentAddress: row.permanent_address,
            currentAddress: row.current_address,
            mobileNumber: row.mobile_number,
            whatsappNumber: row.whatsapp_number,
            email: row.email,
            educationalQualification: row.educational_qualification,
            currentOccupation: row.current_occupation,
            professionalDetails: row.professional_details,
            currentCourse: row.current_course,
            sacraments: {
                baptism: row.baptism,
                confirmation: row.confirmation,
                holyCommunion: row.holy_communion,
            },
            pendingSacraments: row.pending_sacraments,
            hasOrganisationGroup: row.has_organisation_group,
            organisationGroup: row.organisation_group,
            hasParishActivity: row.has_parish_activity,
            parishActivity: row.parish_activity,
            isOutsideParish: row.is_outside_parish,
            isStudent: row.is_student,
            countryCity: row.country_city,
            parishContact: row.parish_contact,
            residentialAddress: row.residential_address,
            isAttendingSundayMass: row.is_attending_sunday_mass,
            sundayMassLocation: row.sunday_mass_location,
            houseName: row.house_name,
            parentsName: row.parents_name,
            parentsNumber: row.parents_number,
            unit: row.unit,
            specials: row.specials,
            healthIssues: row.health_issues,
            additionalInfo: row.additional_info,
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

router.get("/incomplete-count", authenticateToken, async (req, res) => {
    try {
        // Connect to the database
        const conn = await db.connection();

        // Query to count incomplete records
        const query = `
        SELECT COUNT(*) AS incompleteCount FROM parish_youth_data
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
            limit = 10,
            name,
            dobFrom,
            dobTo,
            mobileNumber,
            unit,
            education,
        } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Build the base query
        let query = `SELECT * FROM parish_youth_data WHERE 1=1`;

        // Add search conditions based on provided query parameters
        if (name) {
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
        if (education) {
            query += ` AND educational_qualification LIKE ?`;
        }

        // Append pagination to the query
        query += ` AND is_complete = 1 AND (is_deleted = 0 or is_deleted ='0') LIMIT ? OFFSET ?`;

        // Prepare parameters for the query
        const params = [];
        if (name) params.push(`%${name}%`);
        if (dobFrom && dobTo) params.push(dobFrom, dobTo);
        if (mobileNumber) params.push(mobileNumber);
        if (unit) params.push(unit);
        if (education) params.push(education);
        params.push(parseInt(limit), parseInt(offset));

        // Execute the query for paginated results
        const [rows] = await conn.query(query, params);

        // Query to get total number of records with the same search criteria
        let countQuery = `SELECT COUNT(*) AS total FROM parish_youth_data WHERE 1=1`;

        // Add the same search conditions for counting
        if (name) {
            countQuery += ` AND full_name LIKE ?`;
        }
        if (dobFrom && dobTo) {
            countQuery += ` AND date_of_birth BETWEEN ? AND ?`;
        }
        if (mobileNumber) {
            countQuery += ` AND mobile_number = ?`;
        }
        if (unit) {
            countQuery += ` AND unit = ?`;
        }
        if (education) {
            countQuery += ` AND educational_qualification = ? `;
        }

        countQuery += ` AND is_complete=1 AND (is_deleted = 0 or is_deleted ='0')`;

        const countParams = [];
        if (name) countParams.push(`%${name}%`);
        if (dobFrom && dobTo) countParams.push(dobFrom, dobTo);
        if (mobileNumber) countParams.push(mobileNumber);
        if (unit) countParams.push(unit);
        if (education) countParams.push(education);

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
            prefixedId: "YTH_" + row.id,
            formNumber: row.form_number,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            gender: row.gender,
            permanentAddress: row.permanent_address,
            currentAddress: row.current_address,
            mobileNumber: row.mobile_number,
            whatsappNumber: row.whatsapp_number,
            email: row.email,
            educationalQualification: row.educational_qualification,
            currentOccupation: row.current_occupation,
            professionalDetails: row.professional_details,
            currentCourse: row.current_course,
            sacraments: {
                baptism: row.baptism,
                confirmation: row.confirmation,
                holyCommunion: row.holy_communion,
            },
            pendingSacraments: row.pending_sacraments,
            hasOrganisationGroup: row.has_organisation_group,
            organisationGroup: row.organisation_group,
            hasParishActivity: row.has_parish_activity,
            parishActivity: row.parish_activity,
            isOutsideParish: row.is_outside_parish,
            isStudent: row.is_student,
            countryCity: row.country_city,
            parishContact: row.parish_contact,
            residentialAddress: row.residential_address,
            isAttendingSundayMass: row.is_attending_sunday_mass,
            sundayMassLocation: row.sunday_mass_location,
            houseName: row.house_name,
            parentsName: row.parents_name,
            parentsNumber: row.parents_number,
            unit: row.unit,
            specials: row.specials,
            healthIssues: row.health_issues,
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

router.get("/deletedYouth", authenticateToken, async (req, res) => {
    try {
        // Extract query parameters for pagination
        const { page = 1, limit = 10 } = req.query;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Connect to the database
        const conn = await db.connection();

        // Query to get paginated data
        const query = `
            SELECT * FROM parish_youth_data
            WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')
            LIMIT ? OFFSET ?
        `;

        const [rows] = await conn.query(query, [
            parseInt(limit),
            parseInt(offset),
        ]);

        // Query to get total number of records
        const countQuery = `SELECT COUNT(*) AS total FROM parish_youth_data WHERE is_complete = 1 AND (is_deleted != 0 or is_deleted !='0')`;
        const [countResult] = await conn.query(countQuery);

        // Release the connection
        conn.release();

        // Calculate the total number of pages
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const formattedData = rows?.map((row) => ({
            id: row.id,
            prefixedId: "YTH_" + row.id,
            formNumber: row.form_number,
            fullName: row.full_name,
            dateOfBirth: row.date_of_birth,
            age: row.age,
            gender: row.gender,
            permanentAddress: row.permanent_address,
            currentAddress: row.current_address,
            mobileNumber: row.mobile_number,
            whatsappNumber: row.whatsapp_number,
            email: row.email,
            educationalQualification: row.educational_qualification,
            currentOccupation: row.current_occupation,
            professionalDetails: row.professional_details,
            currentCourse: row.current_course,
            sacraments: {
                baptism: row.baptism,
                confirmation: row.confirmation,
                holyCommunion: row.holy_communion,
            },
            pendingSacraments: row.pending_sacraments,
            hasOrganisationGroup: row.has_organisation_group,
            organisationGroup: row.organisation_group,
            hasParishActivity: row.has_parish_activity,
            parishActivity: row.parish_activity,
            isOutsideParish: row.is_outside_parish,
            isStudent: row.is_student,
            countryCity: row.country_city,
            parishContact: row.parish_contact,
            residentialAddress: row.residential_address,
            isAttendingSundayMass: row.is_attending_sunday_mass,
            sundayMassLocation: row.sunday_mass_location,
            houseName: row.house_name,
            parentsName: row.parents_name,
            parentsNumber: row.parents_number,
            unit: row.unit,
            specials: row.specials,
            healthIssues: row.health_issues,
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
        const query = `DELETE FROM parish_youth_data WHERE id = ?`;
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

router.post("/restoreYouth", authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.connection();
        const query = `UPDATE parish_youth_data SET is_deleted = 0 WHERE id = ?`;
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
