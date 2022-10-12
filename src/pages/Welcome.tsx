import '../style/base.css';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

class WelcomeView extends React.Component {

  render() {
    return (
      <div className="WelcomePage">
        <NavBar></NavBar>
        <div className="titleCard">
          <div className="content">
            <div className="text">
              <h1>Welcome to our <br /> Gamebook Generator!</h1>
              <p>Quickly generate a complete, editable gamebook with a single prompt.</p>
            </div>
          </div>
          <Link to='/generator'>
            <Button variant="light" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div >
    );
  }
}

export default WelcomeView;
