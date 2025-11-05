import db from "../db.js";

//GET RESOURCES
export const getResources = async (req, res) => {
  const { category, page = 1, limit = 15, types } = req.query;
  const offset = (page - 1) * limit;

  const typeFilters = [types];

  try {
    let sql = "";
    let params = [];

    if (category === "books") {
      sql = `SELECT * FROM books`;
      if (typeFilters.length > 0) {
        const placeholders = typeFilters.map(() => "?").join(", ");
        sql += ` WHERE Type IN (${placeholders})`;
        params.push(...typeFilters);
      }
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    } else if (category === "academic-papers") {
      sql = `SELECT * FROM academic_papers`;
      if (typeFilters.length > 0) {
        const placeholders = typeFilters.map(() => "?").join(", ");
        sql += ` WHERE Type IN (${placeholders})`;
        params.push(...typeFilters);
      }
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));
    } else {
      return res.status(400).json({ error: "Invalid category" });
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

//SEARCH RESOURCES
export const searchResources = async (req, res) => {
  const { category, query, page = 1, limit = 15 } = req.query;
  const offset = (page - 1) * limit;

  if (!category || !query) {
    return res.status(400).json({ error: 'Category and query are required' });
  }

  try {
    let sql = '';
    let params = [];

    if (category === 'books') {
      sql = `SELECT * FROM books WHERE Title_Name LIKE ? OR Author_Name LIKE ? LIMIT ? OFFSET ?`;
      const searchTerm = `%${query}%`;
      params = [searchTerm, searchTerm, Number(limit), Number(offset)];
    } else if (category === 'academic-papers') {
      sql = `SELECT * FROM academic_papers WHERE Title_Name LIKE ? OR Author_Name LIKE ? OR Category LIKE ? LIMIT ? OFFSET ?`;
      const searchTerm = `%${query}%`;
      params = [searchTerm, searchTerm, searchTerm, Number(limit), Number(offset)];
    } else {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

//GET DISTINCT TYPES
export const getDistinctTypes = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Category and query are required" });
  }

  try {
    let sql = "";

    if (category === "books") {
      sql = `SELECT DISTINCT Type FROM books`;
    } else if (category === "academic-papers") {
      sql = `SELECT DISTINCT Type FROM academic_papers`;
    } else {
      return res.status(400).json({ error: "Invalid category" });
    }
    const [rows] = await db.query(sql);
    res.json(rows.map(row => row.Type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};


// ADD RESOURCES
export const addResources = async (req, res) => {
  const { category } = req.body;

  if (category === "Academic Paper") {
    const { idNumber, title, author, course, academicYear, type, status } = req.body;

    if (!idNumber) return res.status(400).json({ error: "Item Number is required" });
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!author) return res.status(400).json({ error: "Author is required" });
    if (!academicYear) return res.status(400).json({ error: "Academic Year is required" });
    if (!course) return res.status(400).json({ error: "Course is required" });
    if (!type) return res.status(400).json({ error: "Type is required" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    try {
      if (idNumber) {
        const [existing] = await db.query(
          `SELECT ID FROM academic_papers WHERE ID = ?`,
          [idNumber]
        );

        if (existing.length > 0) {
          return res.status(400).json({ error: "Item Number already exists." });
        }

        try {
          const sql = `
            INSERT INTO academic_papers 
            (ID, Title_Name, Author_Name, Academic_Year, Course, Type, Status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

          const values = [idNumber, title, author, academicYear, course, type, status];
          await db.query(sql, values);
          res.status(201).json({ message: "Academic Paper record added successfully!" });
        } catch (error) {
          console.error("Error adding Academic Paper:", error)
          res.status(500).json({ error: "Server error while adding Academic Paper" })
        }

      }
    } catch {

    }
  }

  if (category === "Book") {
    const { idNumber, title, author, type, status } = req.body;

    if (!idNumber) return res.status(400).json({ error: "Item Number is required" });
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!author) return res.status(400).json({ error: "Author is required" });
    if (!type) return res.status(400).json({ error: "Type is required" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    try {
      if (idNumber) {
        const [existing] = await db.query(
          `SELECT ID FROM books WHERE ID = ?`,
          [idNumber]
        );

        if (existing.length > 0) {
          return res.status(400).json({ error: "Item number already exists." })
        }
      }

      const sql = `
            INSERT INTO books 
            (ID, Title_Name, Author_Name, Type, Status) 
            VALUES (?, ?, ?, ?, ?)
        `;

      const values = [idNumber, title, author, type, status];
      await db.query(sql, values);
      res.status(201).json({ message: "Book record added successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Server error while adding book" })
    }
  }
}







