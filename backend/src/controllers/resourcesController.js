import { parse } from "dotenv";
import db from "../db.js";

//GET RESOURCES
export const getResources = async (req, res) => {

  const { selectedCategory, selectedTypes, page, limit, searchTerm, status } = req.query;

  const currentPage = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const offSet = currentPage * pageSize;

  let searchCondition = [];
  let statusCondition = [];
  let typeCondition = [];
  let allConditions = [];
  let params = [];
  let whereClause = "";
  let sql = "";
  let types;


  try {
    //FOR BOOKS
    if (selectedCategory === "books") {
      //CHECK FOR SEARCHTERM
      if (searchTerm) {
        conditions.push(("title_name LIKE ? OR author_name LIKE ?"));
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        whereClause = `WHERE ${conditions}`;
      }
      //CHECK FOR SELECTEDTYPES
      if (selectedTypes) {
        if (typeof selectedTypes === "string") {
          types = [selectedTypes];
        }
        if (types && Array.isArray(types) || selectedTypes && Array.isArray(selectedTypes)) {

          const length = types ? types.length : selectedTypes.length;

          if (length > 0) {
            for (let i = 0; i < length; i++) {
              conditions.push(("type = ?"));
            }
            whereClause = `WHERE ${conditions.join(" OR ")}`;
          }
        }
        params.push(...(types ? types : selectedTypes));
      }

      params.push(pageSize, offSet);
      sql = `SELECT * FROM books ${whereClause} LIMIT ? OFFSET ?`
      console.log(sql);
      console.log(params);

      const [rows] = await db.query(sql, params);
      const sqlTotalQuery = `SELECT COUNT(*) AS total FROM books ${whereClause}`;
      const [total] = await db.query(sqlTotalQuery, params);
      const totalCount = total[0].total;

      res.json({ rows, total: totalCount });

    }

    //FOR ACADEMIC PAPERS
    if (selectedCategory === "academic-papers") {
      //CHECK FOR SELECTEDTYPES
      if (selectedTypes) {
        if (typeof selectedTypes === "string") {
          types = [selectedTypes];
        }
        if (types && Array.isArray(types) || selectedTypes && Array.isArray(selectedTypes)) {
          const length = types ? types.length : selectedTypes.length;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              typeCondition.push((("type = ?")));
            }
          }
        }
        params.push(...(types ? types : selectedTypes));

        if (typeCondition && typeCondition.length > 0) {
          allConditions.push(`(${typeCondition.join(" OR ")})`);
        }
      }
      //CHECK FOR SEARCHTERM
      if (searchTerm && searchTerm.trim() !== "") {
        searchCondition.push(("title_name LIKE ? OR author_name LIKE ? OR course LIKE ?"));
        params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        if (searchCondition && searchCondition.length > 0) {
          allConditions.push(searchCondition.join(""));
        }
      }
      //CHECK FOR STATUS
      if (status !== "") {
        statusCondition.push(("status = ?"));
        params.push(status);
        if (statusCondition && statusCondition.length > 0) {
          allConditions.push(statusCondition.join(""));
        }
      }

      allConditions.length > 0 ? whereClause = `WHERE ${allConditions.join("  AND ")}` : "";

      params.push(pageSize, offSet);
      sql = `SELECT * FROM academic_papers ${whereClause} LIMIT ? OFFSET ?`

      const [rows] = await db.query(sql, params);
      const sqlTotalQuery = `SELECT COUNT(*) AS total FROM academic_papers ${whereClause}`;
      const [total] = await db.query(sqlTotalQuery, params);
      const totalCount = total[0].total;
      res.json({ rows, total: totalCount });
    }

  } catch (error) {
    console.error("Error while fetching academic papers:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving academic papers.",
    });
  }
}

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







