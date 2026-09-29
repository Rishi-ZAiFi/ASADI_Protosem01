import { Router } from 'express';
import {
  handleGeminiGenerate,
  handleTrendScout,
  handleContentEvaluation,
} from '../controllers/geminiController.js';

const router = Router();

// POST /api/gemini/generate (Agent 2: Script Builder Agent)
router.post('/generate', handleGeminiGenerate);

// POST /api/gemini/trends/scout (Agent 1: Trend Scout Agent)
router.post('/trends/scout', handleTrendScout);

// POST /api/gemini/evaluate (Agent 3: Content Critic & Evaluator Agent)
router.post('/evaluate', handleContentEvaluation);

export default router;
