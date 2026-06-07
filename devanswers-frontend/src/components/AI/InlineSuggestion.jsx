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

  const formatPreview = (value) => {
    if (!value) return 'None provided';
    return value.length > 200 ? `${value.substring(0, 200)}...` : value;
  };

  return (
    <div className="inline-suggestion mt-2 mb-3">
      <div className="suggestion-box">
        <div className="suggestion-label">
          <strong>AI Suggestion:</strong>
        </div>
        <div className="suggestion-compare">
          <div className="suggestion-preview suggestion-preview-original">
            <div className="suggestion-preview-label">Current</div>
            <div>{formatPreview(originalValue)}</div>
          </div>
          <div className="suggestion-preview suggestion-preview-improved">
            <div className="suggestion-preview-label">Suggested</div>
            <div>{formatPreview(suggestedValue)}</div>
          </div>
        </div>
        <div className="suggestion-actions">
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => onAccept(fieldName)}
            className="me-2"
          >
            Accept
          </Button>
          <Button
            type="button"
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
