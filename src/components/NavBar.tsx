import { Container, Navbar } from 'react-bootstrap';
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <AiFillHome />{' '}
                            CYOA Generator
                        </Link>

                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}
