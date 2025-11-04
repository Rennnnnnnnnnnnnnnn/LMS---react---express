
import express from 'express';
import {
    getAccounts,
    getCoursesWithSections,
    addAccount,
    deleteAccount,
    editAccount
} from '../controllers/accountsController.js';
import { upload } from "../middleware/multer.js"; // the multer config above


const router = express.Router();

router.get('/getAccounts', getAccounts);
router.get('/courses-with-sections', getCoursesWithSections);
router.delete('/:Student_Number', deleteAccount);
router.post("/addAccount", upload.single("profileImage"), addAccount);
router.put('/:Student_Number', upload.single("profileImage"), editAccount);


export default router;
