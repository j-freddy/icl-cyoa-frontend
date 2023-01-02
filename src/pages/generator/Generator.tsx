import { Container, createStyles, Loader, Stack } from "@mantine/core";
import { useEffect } from 'react';
import StoryTitle from '../../components/generator/StoryTitle';
import {
  getGraph, selectStoryGraphWasLoaded, selectStoryId, selectStoryIsEmpty
} from '../../store/features/storySlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import '../../style/base.css';
import EmptyStoryViz from './content/EmptyStoryViz';
import StoryViz from './content/StoryViz';


const useStyles = createStyles((theme) => ({
  stack: {
    // maxWidth: "880px",
  },
}));


function GeneratorView () {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const storyGraphWasLoaded = useAppSelector(selectStoryGraphWasLoaded);
  const storyIsEmpty = useAppSelector(selectStoryIsEmpty);
  const storyId = useAppSelector(selectStoryId);

  const url: string = window.location.href;
  const splitUrl = url.split('/');
  const id = splitUrl[splitUrl.length - 1];


  useEffect(() => {
    if (id !== null && id !== storyId) {
      dispatch(getGraph({ storyId: id }));
    }
  }, [dispatch, storyId]);


  const StoryContent = () => {

    if (!storyGraphWasLoaded || id !== storyId) {
      return (
        <div className={"loader"}>
          <Loader />
        </div>
      );
    }

    return (
      <Stack align="center" className={classes.stack}>
        <StoryTitle />
        {storyIsEmpty
          ? <EmptyStoryViz />
          : <StoryViz />
        }
      </Stack>
    );
  }


  return (
    <Container className="wrapper">
      <StoryContent />
    </Container>
  );
}

export default GeneratorView;
