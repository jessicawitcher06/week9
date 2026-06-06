import {
  improveQuestionService,
  summarizeAnswersService,
} from "../services/aiService.js";

export const improveQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  const improvements = await improveQuestionService(title, description, tags);

  res.status(200).json({
    success: true,
    message: "Question improved successfully",
    data: improvements,
  });
};

export const summarizeAnswers = async (req, res) => {
  const { questionText, answersText } = req.body;

  const result = await summarizeAnswersService(questionText, answersText);

  res.status(200).json({
    success: true,
    message: "Answers summarized successfully",
    data: result,
  });
};
