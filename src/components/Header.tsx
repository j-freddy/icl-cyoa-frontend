import { FormEvent } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { AiFillHome } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { reqLoginWithSession } from "../api/restRequests";
import { Link } from 'react-router-dom';
import "./Header.css";
import StatusCode from "status-code-enum";

export default function Header() {
	const navigate = useNavigate();

	const getStories = async (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const response = await reqLoginWithSession();
		if (response.status === StatusCode.ClientErrorUnauthorized) {
			navigate("/login");
		} else {
			// TODO: this should either navigate to / with loggedIn set to true and render the list of stories conditionally or use the stories returned here to render on another page
			// await API.getStories();
			navigate("/");
		}
	};

	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<Link to="/dashboard">
                	<AiFillHome />{' '}
                    CYOA Generator
                </Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/generator">Generator</Link>
				<Button
					variant={"link"}
					type="submit"
					onClick={(e) => getStories(e)}>
					<BiUser size="16" fill="var(--my-link)" />
				</Button>
			</Container>
		</Navbar>
	);
}
