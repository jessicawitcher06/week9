import { Button } from 'react-bootstrap';
import './InlineSuggestion.css';

const InlineSuggestion = ({
  fieldName,
  originalValue,
  suggestedValue,
  onAccept,
  onReject,
}) => {
  if (!suggestedValue) return null;

  return (
    <div className="inline-suggestion mt-2 mb-3">
      <div className="suggestion-box">
        <div className="suggestion-label">
          <strong>AI Suggestion:</strong>
        </div>
        <div className="suggestion-preview">
          {suggestedValue.length > 200
            ? `${suggestedValue.substring(0, 200)}...`
            : suggestedValue}
        </div>
        <div className="suggestion-actions">
          <Button
            variant="success"
            size="sm"
            onClick={() => onAccept(fieldName)}
            className="me-2"
          >
            Accept
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onReject(fieldName)}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InlineSuggestion;
