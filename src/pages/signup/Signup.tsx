import { FormEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import StatusCode from "status-code-enum";
import { reqSignup } from "../../api/restRequests";

const SignupView = () => {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const [loginError, setLoginError] = useState(false);

	const navigate = useNavigate();

	const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await reqSignup(email, password);
		if (response.status === StatusCode.ClientErrorUnauthorized) {
			setLoginError(true);
			return;
		}
		navigate("/generator");
	};

	return (
		<Container id="generator-section">
			<Form onSubmit={loginSubmit}>
				<Form.Group
					className="mb-3"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
				>
					<Form.Label>Email address</Form.Label>
					<Form.Control type="email" placeholder="Enter email" />
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group
					className="mb-3"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
				>
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" />
				</Form.Group>
				<Button variant="primary" type="submit">
					Submit
				</Button>
				{loginError && <small>Invalid credentials.</small>}
			</Form>
			<Link to="/login">
				<Button variant="primary">
				Go to Login
				</Button>
			</Link>
		</Container>
	);
};

export default SignupView;
