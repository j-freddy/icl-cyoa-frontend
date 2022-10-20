import { Container, Navbar } from 'react-bootstrap';
import { AiFillHome } from "react-icons/ai";

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <AiFillHome />{' '}
                    CYOA Generator
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}
