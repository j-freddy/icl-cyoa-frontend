import { Center, Container, Loader, Stack } from "@mantine/core";
import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import StoryTitle from '../../components/generator/StoryTitle';
import { deleteStory } from "../../store/features/accountSlice";
import {
  getGraph, selectLoadingType, selectStoryGraphWasLoaded, selectStoryId, selectStoryIsEmpty
} from '../../store/features/storySlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import '../../style/base.css';
import { INITIAL_INPUT_PAGE } from "../../utils/pages";
import LoadingInitialParagraph from '../../components/generator/LoadingInitialParagraph';
import StoryViz from '../../components/generator/StoryViz';


function GeneratorView() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const storyGraphWasLoaded = useAppSelector(selectStoryGraphWasLoaded);
  const storyIsEmpty = useAppSelector(selectStoryIsEmpty);
  const storyId = useAppSelector(selectStoryId);
  const loadingType = useAppSelector(selectLoadingType);

  const url: string = useLocation().pathname;
  const splitUrl = url.split('/');
  const id = splitUrl[splitUrl.length - 1];


  useEffect(() => {
    if (id !== null && id !== storyId) {
      dispatch(getGraph({ storyId: id }));
    }
  }, [dispatch, storyId]);

  useEffect(() => {
    if (storyGraphWasLoaded && id === storyId && storyIsEmpty && loadingType === null) {
      dispatch(deleteStory(id));
      navigate(INITIAL_INPUT_PAGE);
    }
  }, [dispatch, navigate, storyGraphWasLoaded, storyId, storyIsEmpty, loadingType]);


  const StoryContent = () => {

    if (storyGraphWasLoaded && id === storyId) {
      if (!storyIsEmpty) {
        return (
          <Stack align="center">
            <StoryTitle />
            <StoryViz />
          </Stack>
        );
      }

      if (loadingType !== null) {
        return (<LoadingInitialParagraph />);
      }
    }

    return (
      <Center style={{ height: 200 }}>
        <Loader />
      </Center>
    );
  }


  return (
    <Container className="wrapper">
      <StoryContent />
    </Container>
  );
}

export default GeneratorView;
