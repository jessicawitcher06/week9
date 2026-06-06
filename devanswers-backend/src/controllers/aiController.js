import {
  improveQuestionService,
  summarizeAnswersService,
} from "../services/aiService.js";
import { createAppError } from "../utils/createAppError.js";

export const improveQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description) {
    throw createAppError("Title and description are required", 400);
  }

  const improvements = await improveQuestionService(title, description, tags);

  res.status(200).json({
    success: true,
    message: "Question improved successfully",
    data: improvements,
  });
};

export const summarizeAnswers = async (req, res) => {
  const { questionId, questionText, answersText } = req.body;

  if (!questionId && (!questionText || !answersText)) {
    throw createAppError(
      "Provide questionId, or provide questionText and answersText",
      400,
    );
  }

  const result = await summarizeAnswersService({
    questionId,
    questionText,
    answersText,
  });

  res.status(200).json({
    success: true,
    message: "Answers summarized successfully",
    data: result,
  });
};
