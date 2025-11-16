import db from "../db.js";

export const getAccounts = async (req, res) => {

    const { page, limit, filters, searchTerm } = req.query;

    const currentPage = parseInt(page, 10) || 0;
    const pageSize = parseInt(limit, 10) || 10;
    const offSet = (currentPage) * pageSize;

    const conditions = [];
    const params = [];
    const searchCondition = [];
    const searchParams = [];

    try {
        // Split filters by semicolons to separate each subject
        const filterEntries = filters.split(';');
        // Convert the array of strings into an object
        const parsedFilters = filterEntries.reduce((acc, entry) => {
            // Check if the entry contains a colon (i.e., subject:sections)
            if (entry.includes(':')) {
                const [course, sections] = entry.split(':');
                const sectionArray = sections.split(',');  // Split the sections by commas
                acc[course] = sectionArray;  // Add the subject and its sections to the accumulator
            } else {
                // If no colon, treat it as a subject with no sections
                acc[entry] = [];  // Empty array if no sections are provided
            }
            return acc;
        }, {});

        if (filters) {
            Object.entries(parsedFilters).forEach(([course, sections]) => {
                if (sections.length > 0) {
                    const placeholders = sections.map(() => '?').join(',');
                    conditions.push(`(Course = ? AND Year_And_Section IN (${placeholders}))`);
                    params.push(course, ...sections);
                } else {
                    conditions.push(`(Course = ?)`);
                    params.push(course);
                }
            })
        }

        let whereClause;

        if (searchTerm && conditions && conditions.length > 0) {
            searchCondition.push(`(Name LIKE ? OR Email LIKE ?)`);
            searchParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
            params.push(...searchParams.map(p => `${p}`));
            whereClause = `WHERE ${conditions.join(' OR ')} AND ${searchCondition.join()}`;
        } else if (searchTerm) {
            searchCondition.push(`(Name LIKE ? OR Email LIKE ?)`);
            searchParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
            params.push(...searchParams.map(p => `${p}`));
            whereClause = `WHERE ${searchCondition.join()}`
        } else if (conditions && conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' OR ')}`;
        }
        const sqlQuery = `SELECT * FROM accounts ${whereClause} LIMIT ? OFFSET ?`;
        const allParams = [...params, pageSize, offSet];

        const [rows] = await db.query(sqlQuery, allParams);

        const sqlTotalQuery = `SELECT COUNT(*) AS total FROM accounts ${whereClause}`;
        const [total] = await db.query(sqlTotalQuery, allParams);
        const totalCount = total[0].total;

        res.json({ rows, total: totalCount });
        return;
    } catch (error) {
        console.error("Error while fetching accounts:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving accounts.",
        });
    }
}

// GET DISTINCT COURSES, YEAR AND SECTIONS
export const getCoursesWithSections = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT Course, GROUP_CONCAT(DISTINCT Year_And_Section ORDER BY Year_And_Section ASC) AS sections
      FROM accounts
      GROUP BY Course
      ORDER BY Course ASC
    `);

        // Convert sections from string to array
        const result = rows.map(row => ({
            course: row.Course,
            sections: row.sections.split(',')
        }));
        res.json(result);
    } catch (err) {
        console.error("Error fetching courses with sections:", err);
        res.status(500).json({ error: "Database query failed" });
    }
};

// ADD NEW ACCOUNT
export const addAccount = async (req, res) => {
    const { Name, Course, Year_And_Section, Email, Student_Number, Account_Type } = req.body;

    // Basic validations
    if (!Name) return res.status(400).json({ error: "Name is required." });
    if (!Course) return res.status(400).json({ error: "Course is required." });
    if (!Year_And_Section) return res.status(400).json({ error: "Year & Section is required." });
    if (!Email) return res.status(400).json({ error: "Email is required." });
    if (!Student_Number) return res.status(400).json({ error: "Student Number is required." });
    if (!Account_Type) return res.status(400).json({ error: "Account Type is required." });

    try {
        // Check if student number already exists
        const [existing] = await db.query(
            "SELECT * FROM accounts WHERE Student_Number = ?",
            [Student_Number]
        );

        console.log("EXISTING ", existing);

        if (existing.length > 0) {
            return res.status(400).json({ error: "Student Number already exists." });
        }

        // Handle uploaded file
        const Profile_Picture = req.file ? req.file.filename : null;

        // Insert new account
        const sql = `
            INSERT INTO accounts 
            (Name, Course, Year_And_Section, Email, Student_Number, Account_Type, Profile_Picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [Name, Course, Year_And_Section, Email, Student_Number, Account_Type, Profile_Picture];

        await db.query(sql, values);

        res.status(201).json({ message: "Account added successfully!" });
    } catch (err) {
        console.error("Error adding account:", err);
        res.status(500).json({ error: "Server error while adding account." });
    }
};

// EDIT AN ACCOUNT 
export const editAccount = async (req, res) => {
    const { Name, Course, Year_And_Section, Email, Account_Type, Student_Number } = req.body;

    if (!Name) return res.status(400).json({ error: "Name is required." });
    if (!Course) return res.status(400).json({ error: "Course is required." });
    if (!Year_And_Section) return res.status(400).json({ error: "Year & Section is required." });
    if (!Email) return res.status(400).json({ error: "Email is required." });
    if (!Student_Number) return res.status(400).json({ error: "Student Number is required." });
    if (!Account_Type) return res.status(400).json({ error: "Account Type is required." });

    try {
        const Profile_Picture = req.file ? req.file.filename : null;

        const sql = `
        UPDATE accounts 
        SET Name = ?, Course = ?, Year_And_Section = ?, Email = ?, Profile_Picture = ?, Account_Type = ?
        WHERE Student_Number = ?
        `;

        const values = [Name, Course, Year_And_Section, Email, Profile_Picture, Account_Type, Student_Number];
        await db.query(sql, values);

        res.json({ message: "Account updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
};

//  DELETE AN ACCOUNT
export const deleteAccount = async (req, res) => {
    const { Student_Number } = req.params;

    if (!Student_Number) {
        return res.status(400).json({ error: "Student Number is required." });
    }

    try {
        console.log("NAM", Student_Number);
        const [result] = await db.query(
            "DELETE FROM accounts WHERE Student_Number = ?",
            [Student_Number]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Account not found." });
        }

        res.status(200).json({ message: "Account deleted successfully." });
    } catch (err) {
        console.error("Error deleting account:", err);
        res.status(500).json({ error: "Server error while deleting account." });
    }
};




