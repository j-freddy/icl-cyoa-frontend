import './InputTextForm.css'
import { useState } from "react";
import { Button } from "react-bootstrap";
import { exampleText } from '../../features/storySlice';

interface InputTextFormProps {
  handleGenerateText: (text: string) => void
}

const InputTextForm = (props: InputTextFormProps) => {
  const [text, setText] = useState("");

  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  return (
    <div className="input-form">
      <p className="example-text">
        <b>Example</b>
        <br />
        {exampleText}
      </p>
      <textarea
        className="input-text"
        value={text}
        id="input-text"
        disabled={false}
        placeholder="Input your starting paragraph here"
        onChange={handleInputText}
      />
      <Button
        className="submit-button"
        variant="light"
        onClick={() => props.handleGenerateText(text)}>
        Generate
      </Button>
    </div>
  );
};

export default InputTextForm;
