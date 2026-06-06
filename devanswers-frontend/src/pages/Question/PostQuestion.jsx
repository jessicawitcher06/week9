import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPaperPlane, FaMagic } from 'react-icons/fa';

import { postQuestion } from '../../reducers/questionSlice.js';
import { improveQuestion } from '../../services/aiService.js';
import InlineSuggestion from '../../components/AI/InlineSuggestion.jsx';

import { Col, Container, Form, Button, Card, Row, Spinner, Alert } from 'react-bootstrap';
import './PostQuestion.css';

const PostQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleImproveQuestion = async () => {
    if (!title.trim() || !description.trim()) {
      setAiError('Please fill in title and description before requesting improvements');
      return;
    }

    setLoadingAI(true);
    setAiError(null);
    try {
      const improvements = await improveQuestion(title, description, tags, userInfo?.token);
      setSuggestions({
        originalTitle: title,
        improvedTitle: improvements.improvedTitle,
        originalDescription: description,
        improvedDescription: improvements.improvedDescription,
        originalTags: tags,
        improvedTags: improvements.improvedTags,
      });
    } catch (error) {
      setAiError(error.response?.data?.message || 'Failed to get AI improvements');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAcceptSuggestion = (field) => {
    if (field === 'title') {
      setTitle(suggestions.improvedTitle);
    } else if (field === 'description') {
      setDescription(suggestions.improvedDescription);
    } else if (field === 'tags') {
      setTags(suggestions.improvedTags);
    }
    handleRejectSuggestion(field);
  };

  const handleRejectSuggestion = (field) => {
    setSuggestions((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      if (field === 'title') {
        updated.improvedTitle = null;
      } else if (field === 'description') {
        updated.improvedDescription = null;
      } else if (field === 'tags') {
        updated.improvedTags = null;
      }
      const hasAnySuggestions =
        updated.improvedTitle || updated.improvedDescription || updated.improvedTags;
      return hasAnySuggestions ? updated : null;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(postQuestion({ title, description, tags }));

      if (postQuestion.fulfilled.match(result)) {
        const newQuestion = result.payload;
        alert('Question posted successfully!');
        navigate(`/question/${newQuestion._id}`);
      }
    } catch (error) {
      console.error('Error posting question:', error);
      alert('Failed to post question. Please try again.');
    }
  };

  return (
    <Container className="py-3 px-2 py-sm-4 px-sm-3 pq-page-container">
      <Row className="justify-content-center">
         <Col xs={12} lg={10} xl={9}>
            <Card className="mb-4 pq-header-card">
              <Card.Body className="p-3 p-sm-4">
                  <Card.Title as="h2" className="pq-title">
                    Ask a Question
                  </Card.Title>
                  <p className="text-muted mb-0">Be specific and imagine you're asking another person</p>
              </Card.Body>
            </Card>

            <Card className="pq-body-card">
              <Card.Body className="p-3 p-sm-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="title" className="pq-label">
                      Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your programming question?"
                      required
                      className="pq-input"
                    />
                    <InlineSuggestion
                      fieldName="title"
                      originalValue={suggestions?.originalTitle}
                      suggestedValue={suggestions?.improvedTitle}
                      onAccept={handleAcceptSuggestion}
                      onReject={handleRejectSuggestion}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="description" className="pq-label">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more details about your question..."
                      rows={10}
                      required
                      className="pq-textarea"
                    />
                    <InlineSuggestion
                      fieldName="description"
                      originalValue={suggestions?.originalDescription}
                      suggestedValue={suggestions?.improvedDescription}
                      onAccept={handleAcceptSuggestion}
                      onReject={handleRejectSuggestion}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="tags" className="pq-label">
                      Tags (comma-separated)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="tags"
                      name="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., javascript, react, css"
                      className="pq-input"
                    />
                    <Form.Text className="text-muted">
                      Add up to 5 tags to describe what your question is about
                    </Form.Text>
                    <InlineSuggestion
                      fieldName="tags"
                      originalValue={suggestions?.originalTags}
                      suggestedValue={suggestions?.improvedTags}
                      onAccept={handleAcceptSuggestion}
                      onReject={handleRejectSuggestion}
                    />
                  </Form.Group>

                  {aiError && (
                    <Alert variant="danger" className="mb-3" dismissible onClose={() => setAiError(null)}>
                      {aiError}
                    </Alert>
                  )}

                  <Button
                    type="button"
                    variant="outline-success"
                    size="lg"
                    className="w-100 mb-3"
                    onClick={handleImproveQuestion}
                    disabled={loadingAI || !title.trim() || !description.trim()}
                  >
                    {loadingAI ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <FaMagic className="me-2" />
                        Improve with AI
                      </>
                    )}
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 pq-btn"
                  >
                    <FaPaperPlane className="me-2" />
                    Post Question
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Container>
  );
};

export default PostQuestion;
