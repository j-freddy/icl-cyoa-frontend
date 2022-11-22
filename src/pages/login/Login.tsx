import { FormEvent, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login, loginWithSession } from "../../features/accountSlice";


const LoginView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedIn = useAppSelector((state) => state.account.loggedIn);
  const credentialsLoginFail = useAppSelector((state) => state.account.credentialsLoginFail);

  useEffect(() => { 
    if (!loggedIn) dispatch(loginWithSession());
  }, [dispatch, loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({email, password}));
  }

  return (
    <Container id="generator-section">
      <Form onSubmit={loginSubmit}>
        <Form.Group className="mb-3" onChange={(event: any) => setEmail(event.target.value)}>
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" onChange={(event: any) => setPassword(event.target.value)}>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {
          credentialsLoginFail 
          &&
          <small>Invalid credentials.</small>
        }
      </Form>
      <Link to="/signup">
        <Button variant="primary">
          Go to Signup
        </Button>
      </Link>
    </Container>
  )

}

export default LoginView;
