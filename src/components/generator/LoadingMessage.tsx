import './LoadingMessage.css'
import { Toast, ToastContainer } from 'react-bootstrap';
import { SectionType } from '../../graph/types';

interface LoadingMessageProps {
  sectionType: SectionType;
  numSections: number;
}

export default function LoadingMessage(props: LoadingMessageProps) {
  return (
    <ToastContainer className="loading-message">
      <Toast>
        <Toast.Body>
          <strong>Generating {props.sectionType}</strong>, ({props.numSections}) left
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
