import '../style/base.css';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Container } from 'react-bootstrap';

interface InputTextFormProps {
  exampleText: string,
}

const InputTextForm = (props: InputTextFormProps) => {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const handleGenerate = (event: React.MouseEvent<HTMLButtonElement>): void => {
    // Generate some cool text
    console.log("Do nothing");
  };

  return (
    <div className="input-form">
      <p className="example-text">
        <b>Example</b>
        <br />
        {props.exampleText}
      </p>
      <textarea className="input-text" value={text}
        onChange={handleTextChange} />
      <Button className="submit-button" variant="light"
        onClick={handleGenerate}>
        Generate
      </Button>
    </div>
  );
}

const GeneratorView = () => {
  // TODO Move out of Generator.tsx
  const exampleText = `You are a commoner living in the large kingdom of
  Garion. Your kingdom has been in bitter war with the neighboring kingdom,
  Liore, for the past year. You dream of doing something great and going on an
  adventure. You walk around town and see warning posters about the dangers of
  the dark forest at the edge of town. You go to the market and see military
  representatives signing people up for the army.`;

  return (
    <Container id="generator-section" className="wrapper">
      <header id="generator-title">
        <h1>Enter a paragraph</h1>
      </header>
      <InputTextForm exampleText={exampleText} />
    </Container>
  );
}

export default GeneratorView;
