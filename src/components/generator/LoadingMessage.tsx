import './LoadingMessage.css'
import { Toast, ToastContainer } from 'react-bootstrap';
import { LoadingType } from '../../graph/types';

interface LoadingMessageProps {
  sectionType: LoadingType;
  numSections: number;
}

export default function LoadingMessage(props: LoadingMessageProps) {
  const typeMessage = new Map<LoadingType, string>([
    [LoadingType.GenerateParagraph, "Generating paragraph"],
    [LoadingType.GenerateActions, "Generating actions"],
    [LoadingType.GenerateEnding, "Generating ending"],
    [LoadingType.ConnectingNodes, "Connecting nodes"],
  ]);
  const message = typeMessage.get(props.sectionType)

  return (
    <ToastContainer className="loading-message">
      <Toast>
        <Toast.Body>
          <strong>{message}</strong>, ({props.numSections}) left
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
