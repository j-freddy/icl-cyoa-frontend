import {
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Title
} from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryListItem from '../../components/dashboard/StoryListItem';
import {
  loadStories, selectStories
} from '../../store/features/accountSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { INITIAL_INPUT_PAGE } from '../../utils/pages';

const DashboardView = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);


  useEffect(() => {
    dispatch(loadStories());
  }, [dispatch]);


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
