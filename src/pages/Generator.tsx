import '../style/base.css';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { editText, generateText } from '../features/text/inputFormSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'

interface InputTextFormProps {
  exampleText: string,
}

interface GeneratorViewProps {
  exampleText: string,
}

const InputTextForm = (props: InputTextFormProps) => {
  const text = useAppSelector((state) => state.text.value)
  const dispatch = useAppDispatch()
  const handleInputText = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch(editText(e.currentTarget.value));
  }
  const handleGenerate = (): void => { dispatch(generateText()) }


  return (
    <div className="input-form">
      <p className="example-text">
        <b>Example</b>
        <br />
        {props.exampleText}
      </p>
      <textarea
        className="input-text"
        value={text}
        placeholder="Input your starting paragraph here"
        onChange={handleInputText}
      />
      <Button className="submit-button" variant="light"
        onClick={handleGenerate}>
        Generate
      </Button>
    </div>
  );
}

const GeneratorView = (props: GeneratorViewProps) => {

  return (
    <Container id="generator-section" className="wrapper">
      <header id="generator-title">
        <h1>Enter a paragraph</h1>
      </header>
      <InputTextForm exampleText={props.exampleText} />
    </Container>
  );
}

export default GeneratorView;
