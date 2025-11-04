import express from 'express';
import cors from "cors";
import db from './db.js';
import errorHandling from './middleware/errorHandling.js';
import loggerHandling from './middleware/loggerHandling.js';
import notFoundHandling from './middleware/notFoundHandling.js';
import resourcesRoutes from './routes/resourcesRoute.js';
import accountsRoutes from './routes/accountsRoute.js';
import multer from "multer";
import path from "path";


const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(loggerHandling);
app.use(express.json()); 

async function testDbConnection() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log('Database connection successful!');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

app.use('/resources', resourcesRoutes);
app.use('/accounts', accountsRoutes);

app.use("/uploads", express.static("public/uploads"));







// FINAL MIDDLEWARES
app.use(notFoundHandling);
app.use(errorHandling);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testDbConnection();
}); 