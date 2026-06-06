import { Button, Alert } from 'react-bootstrap';
import './QuestionImprovementSuggestions.css';

const QuestionImprovementSuggestions = ({
  suggestions,
  onAccept,
  onReject,
}) => {
  if (!suggestions) return null;

  return (
    <div className="mb-4 suggestion-container">
      <Alert variant="info" className="mb-3">
        <Alert.Heading className="mb-2">AI Suggestions</Alert.Heading>
        <p className="mb-0 text-muted">Review and accept or reject each suggestion</p>
      </Alert>

      {suggestions.improvedTitle && (
        <div className="mb-3 suggestion-item">
          <div className="suggestion-header">
            <strong>Suggested Title</strong>
          </div>
          <div className="suggestion-content">
            <p className="original-text">
              <span className="label">Current:</span> {suggestions.originalTitle}
            </p>
            <p className="improved-text">
              <span className="label">Suggested:</span> {suggestions.improvedTitle}
            </p>
          </div>
          <div className="suggestion-actions">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept('title')}
              className="me-2"
            >
              Accept
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onReject('title')}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {suggestions.improvedDescription && (
        <div className="mb-3 suggestion-item">
          <div className="suggestion-header">
            <strong>Suggested Description</strong>
          </div>
          <div className="suggestion-content">
            <p className="original-text">
              <span className="label">Current:</span> {suggestions.originalDescription?.substring(0, 150)}...
            </p>
            <p className="improved-text">
              <span className="label">Suggested:</span> {suggestions.improvedDescription?.substring(0, 150)}...
            </p>
          </div>
          <div className="suggestion-actions">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept('description')}
              className="me-2"
            >
              Accept
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onReject('description')}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {suggestions.improvedTags && (
        <div className="mb-3 suggestion-item">
          <div className="suggestion-header">
            <strong>Suggested Tags</strong>
          </div>
          <div className="suggestion-content">
            <p className="original-text">
              <span className="label">Current:</span> {suggestions.originalTags}
            </p>
            <p className="improved-text">
              <span className="label">Suggested:</span> {suggestions.improvedTags}
            </p>
          </div>
          <div className="suggestion-actions">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept('tags')}
              className="me-2"
            >
              Accept
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onReject('tags')}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionImprovementSuggestions;
