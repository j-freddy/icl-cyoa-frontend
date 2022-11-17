import './LoadingMessage.css'
import { Toast, ToastContainer } from 'react-bootstrap';
import { LoadingType } from '../../utils/graph/types';

interface LoadingMessageProps {
  sectionType: LoadingType;
}

export default function LoadingMessage(props: LoadingMessageProps) {
  const typeMessage = new Map<LoadingType, string>([
    [LoadingType.GenerateParagraph, "Generating paragraph"],
    [LoadingType.GenerateActions, "Generating actions"],
    [LoadingType.GenerateEnding, "Generating ending"],
    [LoadingType.ConnectingNodes, "Connecting nodes"],
    [LoadingType.InitialStory, "Generating initial story"],
  ]);
  const message = typeMessage.get(props.sectionType);

  return (
    <ToastContainer className="loading-message">
      <Toast>
        <Toast.Body>
          <strong>{message}</strong>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
