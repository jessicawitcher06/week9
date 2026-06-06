import express from "express";
import {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  upvoteAnswer,
  downvoteAnswer,
} from "../controllers/answerController.js";
import authenticate from "../middleware/authHandler.js";

const router = express.Router();

// Public route to get answers for a question
router.get("/question/:questionId", getAnswersByQuestionId);

// Protected route to create an answer for a question
router.post("/question/:questionId", authenticate, createAnswer);

// Protected routes - authentication required
router.put("/:answerId", authenticate, updateAnswer);
router.delete("/:answerId", authenticate, deleteAnswer);
router.post("/:answerId/upvote", authenticate, upvoteAnswer);
router.post("/:answerId/downvote", authenticate, downvoteAnswer);

export default router;
