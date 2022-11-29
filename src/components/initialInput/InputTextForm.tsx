import './InputTextForm.css'
import { useState } from "react";
import { exampleText } from '../../features/storySlice';
import { Textarea } from '@mantine/core';
import GenerateButton from './GenerateButton';

interface InputTextFormProps {
  handleGenerateText: (text: string) => void
}

const InputTextForm = (props: InputTextFormProps) => {
  const [text, setText] = useState("");

  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  return (
    <div className="w-full text-center">
      <div className="text-start">
        <Textarea
          placeholder="Input your starting paragraph here."
          description={`Example: ${exampleText}`}
          onChange={handleInputText}
          id="custom-textarea"
        />
      </div>

      <GenerateButton onClick={() => props.handleGenerateText(text)} />
    </div>
  );
};

export default InputTextForm;
