import {
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Title
} from '@mantine/core';
import {
  loginWithSession,
  loadStories,
  selectLoggedIn,
  selectSessionLoginFail,
  selectStories
} from '../../store/features/accountSlice';
import StoryListItem from '../../components/dashboard/StoryListItem';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { IconPlus } from '@tabler/icons'
import { INITIAL_INPUT_PAGE, LOGIN_PAGE } from '../../utils/pages';

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
      navigate(LOGIN_PAGE);
    }
  }, [loggedIn, sessionLoginFail, navigate]);

  useEffect(() => {
    if (loggedIn) {
      dispatch(loadStories());
    }
  }, [loggedIn, dispatch]);


  const goToInitialInputView = () => {
    navigate(INITIAL_INPUT_PAGE);
  };

  
  return (
    <Container className="wrapper">
      <Group position="apart">
        <Title order={1} span={true} color="black">Welcome back!</Title>
        <Button
          sx={{ float: 'right' }}
          variant="filled"
          color="indigo.6"
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
            <StoryListItem
              storyId={story.storyId}
              key={story.storyId}
              name={story.name}
              firstParagraph={story.firstParagraph}
              totalSections={story.totalSections}
            />
          ))
        }
      </Stack>
    </Container >

  );
}

export default DashboardView
