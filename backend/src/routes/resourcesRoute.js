import express from 'express';
import { getResources, getDistinctTypes, addResources, getBookCopy, editResources } from '../controllers/resourcesController.js';

const router = express.Router();

router.get('/getResources', getResources);
router.get('/types', getDistinctTypes);
router.post('/addResources', addResources);
router.get('/getBookCopy', getBookCopy);

router.put('/edit-resources/:id', editResources);

export default router;
