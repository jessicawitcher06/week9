import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAppError } from "../utils/createAppError.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw createAppError("AI service not configured properly", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const improveQuestionService = async (title, description, tags) => {
  try {
    const model = getModel();

    const prompt = `You are a helpful assistant that improves technical questions.

Given the following question details, provide improved versions of each field that are:
- More clear and specific
- Better formatted for readability
- More likely to attract quality answers

Current question:
Title: "${title}"
Description: "${description}"
Tags: "${tags}"

Respond ONLY with valid JSON (no markdown, no extra text) in this exact format:
{
  "improvedTitle": "improved title here",
  "improvedDescription": "improved description here",
  "improvedTags": "tag1,tag2,tag3"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw createAppError("Failed to parse AI response", 500);
    }

    const improvements = JSON.parse(jsonMatch[0]);

    return {
      improvedTitle: improvements.improvedTitle || title,
      improvedDescription: improvements.improvedDescription || description,
      improvedTags: improvements.improvedTags || tags,
    };
  } catch (error) {
    if (error.message.includes("API key")) {
      throw createAppError("AI service not configured properly", 500);
    }
    throw createAppError(
      error.message || "Failed to improve question",
      500
    );
  }
};

export const summarizeAnswersService = async ({
  questionId,
  questionText,
  answersText,
}) => {
  try {
    const model = getModel();

    let resolvedQuestionText = questionText;
    let resolvedAnswersText = answersText;

    if (questionId) {
      const question = await Question.findById(questionId);
      if (!question) {
        throw createAppError("Question not found", 404);
      }

      const answers = await Answer.find({ questionId }).sort({ createdAt: 1 });

      resolvedQuestionText = question.description || question.title;
      resolvedAnswersText = answers.map((answer) => answer.answerText);
    }

    if (!resolvedAnswersText || resolvedAnswersText.length === 0) {
      throw createAppError("No answers to summarize", 400);
    }

    const answersContent = resolvedAnswersText
      .map((answer, index) => `Answer ${index + 1}:\n${answer}`)
      .join("\n\n---\n\n");

    const prompt = `You are a helpful assistant that summarizes technical discussions.

Given the following question and its answers, provide a concise 3-5 sentence summary that captures the key points and best solutions.

Question: "${resolvedQuestionText}"

Answers:
${answersContent}

Provide ONLY the plain text summary (no markdown, no formatting, no bullet points). Keep it to 3-5 sentences.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return { summary };
  } catch (error) {
    if (error.message.includes("API key")) {
      throw createAppError("AI service not configured properly", 500);
    }
    throw createAppError(
      error.message || "Failed to summarize answers",
      500
    );
  }
};
