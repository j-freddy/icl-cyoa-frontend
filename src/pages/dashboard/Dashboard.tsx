import {
  Button,
  Container,
  createStyles,
  Divider,
  Group,
  Loader,
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
      <StoryList />
    </Container >

  );
}

export default DashboardView
