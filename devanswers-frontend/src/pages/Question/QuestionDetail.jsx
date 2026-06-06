import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaMagic } from 'react-icons/fa';

import { fetchQuestionById } from '../../reducers/questionSlice.js';
import { selectIsAuthenticated } from '../../reducers/userSlice.js';
import { summarizeAnswers } from '../../services/aiService.js';
import QuestionContent from '../../components/Question/QuestionContent.jsx';
import AnswerList from '../../components/Answer/AnswerList.jsx';
import AnswerForm from '../../components/Answer/AnswerForm.jsx';
import AnswerSummaryBanner from '../../components/AI/AnswerSummaryBanner.jsx';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { currentQuestion, loading, error } = useSelector((state) => state.question);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestionById(id));
  }, [id, dispatch]);

  const handleSummarizeAnswers = async () => {
    if (!currentQuestion || !currentQuestion.answers || currentQuestion.answers.length < 3) {
      setSummaryError('Not enough answers to summarize');
      return;
    }

    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const answersText = currentQuestion.answers.map((answer) => answer.answerText);
      const result = await summarizeAnswers(
        currentQuestion.description,
        answersText,
        userInfo.token
      );
      setSummary(result.summary);
    } catch (err) {
      setSummaryError(err.response?.data?.message || 'Failed to summarize answers');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleDismissSummary = () => {
    setSummary(null);
  };

  if (loading) {
    return (
      <Container className="qd-loading-container">
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="qd-loading-container">
        <p>Error loading question: {error}</p>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="qd-loading-container">
        <p>Question not found.</p>
      </Container>
    );
  }

  const answerCount = currentQuestion.answers?.length || 0;
  const canShowSummarizeButton =
    isAuthenticated && answerCount >= 3 && !summary;

  return (
    <Container className="qd-container">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <QuestionContent
            question={currentQuestion}
          />

          {summary && (
            <AnswerSummaryBanner
              summary={summary}
              onDismiss={handleDismissSummary}
            />
          )}

          {summaryError && !summary && (
            <Alert variant="danger" className="mb-3" dismissible onClose={() => setSummaryError(null)}>
              {summaryError}
            </Alert>
          )}

          {canShowSummarizeButton && (
            <Button
              variant="outline-success"
              size="lg"
              className="w-100 mb-3"
              onClick={handleSummarizeAnswers}
              disabled={loadingSummary}
            >
              {loadingSummary ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FaMagic className="me-2" />
                  Summarize Answers
                </>
              )}
            </Button>
          )}

          <AnswerList
            answers={currentQuestion.answers}
          />

          <AnswerForm
            questionId={id}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionDetail;
