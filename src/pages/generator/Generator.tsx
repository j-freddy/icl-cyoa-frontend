import { Container, createStyles, Stack } from "@mantine/core";
import { useEffect } from 'react';
import StoryTitle from '../../components/generator/StoryTitle';
import {
  getGraph, selectIsStoryEmpty, selectStoryId, setId
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


const GeneratorView = () => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const isStoryEmpty = useAppSelector(selectIsStoryEmpty);
  const storyId = useAppSelector(selectStoryId);


  useEffect(() => {
    const url: string = window.location.href;
    const splitUrl = url.split('/');
    const id = splitUrl[splitUrl.length - 1];

    if (id !== null && id !== storyId) {
      dispatch(setId({ storyId: id }));
      dispatch(getGraph());
    }
  }, [dispatch, storyId]);


  return (
    <Container className="wrapper">
      <Stack align="center" className={classes.stack}>
        <StoryTitle />
        {isStoryEmpty
          ? <EmptyStoryViz />
          : <StoryViz />
        }
      </Stack>
    </Container>
  );
}

export default GeneratorView;
