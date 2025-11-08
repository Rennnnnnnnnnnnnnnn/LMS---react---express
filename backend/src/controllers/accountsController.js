import db from "../db.js";

// GET ACCOUNTS WITH PAGINATION, SEARCH, AND FILTERS
// export const getAccounts = async (req, res) => {
//       try {
//          const page = parseInt(req.query.page) || 1;
//          const limit = parseInt(req.query.limit) || 10;
//          const offset = (page - 1) * limit;

//          const search = req.query.search ? `%${req.query.search}%` : null;
//          const filters = req.query.filters ? req.query.filters.split(';') : [];

//          let conditions = [];
//          let params = [];

//          // Parse filters
//          filters.forEach(f => {
//              if (f.includes(':')) {
//                  const [course, secs] = f.split(':');
//                  const sectionArr = secs.split(',');
//                  conditions.push(`(Course = ? AND Year_And_Section IN (${sectionArr.map(() => '?').join(',')}))`);
//                  params.push(course, ...sectionArr);
//              } else {
//                  conditions.push(`(Course = ?)`);
//                  params.push(f);
//              }
//          });

//          let where = "WHERE 1=1";
//          if (conditions.length > 0) {
//              where += " AND (" + conditions.join(" OR ") + ")";
//          }

//          // Search filter
//          if (search) {
//              where += " AND Name LIKE ?";
//              params.push(search);
//          }

//          // Main query with sorting
//          const query = `SELECT * FROM accounts ${where} ORDER BY Course ASC, Year_And_Section ASC LIMIT ? OFFSET ?`;
//          params.push(limit, offset);
//          const [rows] = await db.query(query, params);

//          // Count total
//          const countQuery = `SELECT COUNT(*) AS total FROM accounts ${where}`;
//          const [countRows] = await db.query(countQuery, params.slice(0, -2));
//          const total = countRows[0].total;

//          res.json({
//              data: rows,
//              page,
//              limit,
//              total,
//              totalPages: Math.ceil(total / limit)
//          });
//      } catch (err) {
//          console.error(err);
//          res.status(500).json({ error: "Database query failed" });
//      } 

// };


export const getAccounts = async (req, res) => {

    //  const { filters, page, limit, searchTerm } = req.query;

    const { page, limit, filters } = req.query;

    const currentPage = parseInt(page, 10) || 0;
    const pageSize = parseInt(limit, 10) || 10;
    const offSet = (currentPage) * pageSize;

    const conditions = [];
    const params = [];
    console.log("PURE FILTERS: ", filters);
    if (filters) {
        // Split filters by semicolons to separate each subject
        const filterEntries = filters.split(';');
        console.log("filterEntries ", filterEntries);
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

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' OR ')}` : '';
        // add pagination params at the end
        const sqlQuery = `SELECT * FROM accounts ${whereClause} LIMIT ? OFFSET ?`;
        const allParams = [...params, pageSize, offSet];
        const [rows] = await db.query(sqlQuery, allParams);

        const [total] = await db.query(`SELECT COUNT(*) AS total FROM accounts`);
        const totalCount = total[0].total;

        console.log("qweqwe", rows.length, total);
        res.json({ rows, total: totalCount });
        return;
    } else {
        console.log("No filters provided");
        try {
            const [total] = await db.query(`SELECT COUNT(*) AS total FROM accounts`);
            const totalCount = total[0].total;
            const [rows] = await db.query(`SELECT * FROM accounts LIMIT ? OFFSET ?`, [pageSize, offSet]);
            res.json({ rows, total: totalCount });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed' });
        }
    }
};



// // Step 1: Parse the input string
// const parsedFilters = filters.split(';').map(item => {
//     const [course, sections] = item.split(':');
//     return {
//         course_name: course,
//         sections: sections.split(',')
//     };
// });

// console.log("parsedfilters " , parsedFilters);

//     // Step 2: Create SQL query parts
//     const conditions = filters.map(filter => {
//         const courseFilter = `course_name = '${filter.course_name}'`;
//         const sectionFilter = `section IN ('${filter.sections.join("', '")}')`;
//         return `(${courseFilter} AND ${sectionFilter})`;
//     }).join(' OR ');

//     // Step 3: Construct the full query
//     const sqlQuery = `
//     SELECT * 
//     FROM courses 
//     WHERE ${conditions};
//   `;


























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




