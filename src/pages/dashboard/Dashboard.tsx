import './Dashboard.css';
import { Button, Container, ListGroup } from 'react-bootstrap';
import StoryListItem from '../../components/dashboard/StoryListItem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginWithSession, loadStories, selectLoggedIn, selectSessionLoginFail, selectStories } from '../../features/accountSlice';

const DashboardView = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loggedIn = useAppSelector(selectLoggedIn);
    const sessionLoginFail = useAppSelector(selectSessionLoginFail);

    const stories = useAppSelector(selectStories);

    useEffect(() => {
        if (!loggedIn) dispatch(loginWithSession())
    }, [loggedIn, dispatch]);

    useEffect(() => {
        if (!loggedIn && sessionLoginFail) {
            navigate("/login");
        }
    }, [loggedIn, sessionLoginFail, navigate]);

    useEffect(() => {
        if (loggedIn) {
            dispatch(loadStories());
        }
    }, [loggedIn, dispatch]);

    const goToInitialInputView = () => {
        navigate("/initial-input");
    };

    return (
        <Container id="generator-section" className="wrapper">
            <Button onClick={goToInitialInputView}>
                Add New Story
            </Button>
            <ListGroup>
                {
                    stories.map(story =>
                        (<StoryListItem storyId={story.storyId} name={story.name} />))
                }
            </ListGroup>
        </Container>
    );
}

export default DashboardView
