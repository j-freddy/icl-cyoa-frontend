import {
  ThemeIcon,
  Button,
  Container,
  createStyles,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconPlus, IconInfoCircle } from '@tabler/icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryListItem from '../../components/dashboard/StoryListItem';
import {
  loadStories, selectStories
} from '../../store/features/accountSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { INITIAL_INPUT_PAGE } from '../../utils/pages';

const useStyles = createStyles((theme) => ({

  createNewStoryButton: {
    float: 'right',
  },

}));

const DashboardView = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);


  useEffect(() => {
    dispatch(loadStories());
  }, [dispatch]);


  const onCreateNewStoryButtonClick = () => {
    navigate(INITIAL_INPUT_PAGE);
  };


  const StoryList = () => {

    if (stories === undefined) {
      return (
        <div className={"loader"}>
          <Loader />
        </div>
      );
    }

    return (
      <Stack spacing="sm">
        {
          stories?.map(story =>
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
    );
  }



  return (
    <Container className="wrapper">
      <Group position="apart">
        <Title order={1} span={true} color="black">Welcome back!</Title>
        <Button
          className={classes.createNewStoryButton}
          variant="filled"
          leftIcon={<IconPlus />}
          onClick={onCreateNewStoryButtonClick}
        >
          Create New Story
        </Button>
      </Group>
      <Divider my="sm" />
      <Group
        spacing="xs"

        ml={15}
        mb={15}>
        <ThemeIcon
          radius="lg"
          variant="light">
          <IconInfoCircle />
        </ThemeIcon>
        <Text
          fz="xs"
          fs="italic"
          c="dark.04"
          weight={600}
        >
          <Text>We use GPT3 to generate your stories.</Text>
          For faster story generation, you can supply your own API key for GPT3 under Account Settings.
        </Text>
      </Group>
      <StoryList />
    </Container >

  );
}

export default DashboardView
