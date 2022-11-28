import { Button, Container, createStyles, Divider, Group, Stack, Title } from '@mantine/core';
import StoryListItem from '../../components/dashboard/StoryListItem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginWithSession, loadStories, selectLoggedIn, selectSessionLoginFail, selectStories } from '../../features/accountSlice';
import { IconPlus } from '@tabler/icons'

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
        <Container className="wrapper">
            <Group position="apart">
                <Title order={1} span={true} color="black">Welcome back!</Title>
                <Button
                    sx={{ float: 'right' }}
                    variant="light"
                    leftIcon={<IconPlus />}
                    onClick={goToInitialInputView}
                >
                    Create New Story
                </Button>
            </Group>
            <Divider my="sm" />
            <Stack spacing="sm">
                {
                    stories.map(story =>
                    (
                        <StoryListItem storyId={story.storyId} name={story.name} firstParagraph={story.firstParagraph} totalSections={story.totalSections} />
                    ))
                }
            </Stack>
        </Container>

    );
}

export default DashboardView
