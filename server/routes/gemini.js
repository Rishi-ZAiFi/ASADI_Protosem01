import { Router } from 'express';
import { handleGeminiGenerate } from '../controllers/geminiController.js';

const router = Router();

// POST /api/gemini/generate
router.post('/generate', handleGeminiGenerate);

export default router;
