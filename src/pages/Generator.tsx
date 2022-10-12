import '../style/base.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import NavBar from '../components/NavBar';

class Form extends React.Component<
  {}
  ,
  {
    text: string;
  }
>
{
  state = {
    text: ""
  };

  onChange = (event: { currentTarget: { value: string; }; }): void => {
    this.setState({ text: event.currentTarget.value });
  };

  render() {
    return (
      <div>
        <textarea
          value={this.state.text}
          onChange={this.onChange}
        />
        <Button variant="primary">
          Submit
        </Button>{' '}
      </div>
    );
  }
}

function GeneratorView() {
  return (
    <div className="Generator">
      <NavBar></NavBar>
      <header className="Header">
        <h1>
          Enter a paragraph:
        </h1>
        <h2>
          Example: ...
        </h2>
      </header>
      <body className="Body">
        <div className="Form">
          <Form />
        </div>
      </body>
    </div>
  );
}

export default GeneratorView;
