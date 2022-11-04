import { Toast, ToastContainer } from 'react-bootstrap';
import { SectionType } from "../graph/types";

interface LoadingMessageProps {
  sectionType: SectionType;
  numSections: number;
}

export default function LoadingMessage(props: LoadingMessageProps) {
  return (
    <ToastContainer position={'bottom-start'} className='position-fixed'>
      <Toast>
        <Toast.Body style={{ color: '#000', fontSize: '1rem' }}><strong>Generating {props.sectionType}</strong>, ({props.numSections}) left</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
