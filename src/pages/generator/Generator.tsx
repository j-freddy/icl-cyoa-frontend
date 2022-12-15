import '../../style/base.css';;
import { useEffect } from 'react';
import { Container, createStyles, Stack } from "@mantine/core";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectStoryId,
  getGraph,
  setId,
  selectIsStoryEmpty,
} from '../../store/features/storySlice';
import {
  selectLoggedIn,
  selectSessionLoginFail,
  loginWithSession
} from '../../store/features/accountSlice';
import { useNavigate } from 'react-router-dom';
import StoryTitle from '../../components/generator/StoryTitle';
import { startConnecting } from '../../store/features/wsSlice';
import EmptyStoryViz from './content/EmptyStoryViz';
import StoryViz from './content/StoryViz';
import { LOGIN_PAGE } from '../../utils/pages';

const useStyles = createStyles((theme) => ({
  stack: {
    // maxWidth: "880px",
  },
}));

const GeneratorView = () => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isStoryEmpty = useAppSelector(selectIsStoryEmpty);
  const storyId = useAppSelector(selectStoryId);

  const loggedIn = useAppSelector(selectLoggedIn);
  const sessionLoginFail = useAppSelector(selectSessionLoginFail);

  const { classes } = useStyles();

  useEffect(() => {
    dispatch(startConnecting())
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) dispatch(loginWithSession())
  }, [loggedIn, dispatch]);

  useEffect(() => {
    if (!loggedIn && sessionLoginFail) {
      navigate(LOGIN_PAGE);
    }
  }, [loggedIn, sessionLoginFail, navigate]);

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
