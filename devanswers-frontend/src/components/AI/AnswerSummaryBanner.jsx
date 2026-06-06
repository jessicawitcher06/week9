import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './AnswerSummaryBanner.css';

const AnswerSummaryBanner = ({ summary, onDismiss }) => {
  if (!summary) return null;

  return (
    <Alert variant="info" className="banner-container mb-4">
      <div className="banner-header">
        <h5 className="mb-2">Quick Summary</h5>
        <Button
          variant="link"
          className="btn-close-custom"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <FaTimes />
        </Button>
      </div>
      <p className="mb-0 banner-text">{summary}</p>
    </Alert>
  );
};

export default AnswerSummaryBanner;
