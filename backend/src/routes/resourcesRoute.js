import express from 'express';
import { getResources, searchResources, getDistinctTypes } from '../controllers/resourcesController.js';

// NEW
import { addResources } from '../controllers/resourcesController.js';

const router = express.Router();

router.get('/', getResources);
router.get('/search', searchResources);
router.get('/types', getDistinctTypes);
router.post('/addResources', addResources);

export default router;
