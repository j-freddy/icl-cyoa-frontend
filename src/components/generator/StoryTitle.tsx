import {
  ActionIcon, Button, Container, createStyles,
  Divider,
  Group, Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { useEffect, useMemo, useState } from 'react';
import { saveName, selectStoryGraph, selectStoryTitle, setName } from '../../store/features/storySlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getStoryNodes } from '../../utils/graph/storyUtils';
import Downloader from './Downloader';
import Saver from './Saver';


const useStyles = createStyles((theme) => ({

  titleBox: {
    backgroundColor: theme.colors.gray[0],
    padding: theme.spacing.md,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: theme.radius.sm,
    width: "100%",
  },
  title: {
    width: "100%",
    alignItems: 'left',
  },
  leftBox: {
    width: "72%",
  },
  rightBox: {
    width: "24%",
  },
  buttons: {
    width: "100%", 
    justifyContent: 'center',
  },
}));


export default function StoryTitle() {
  const { classes } = useStyles();

  const storyGraph = useAppSelector(selectStoryGraph);

  const story = useMemo(() => {
    return getStoryNodes(storyGraph, false);
  }, [storyGraph]);

  return (
    <>
      <Container size="xl" className={classes.titleBox}>
        <Group>
          <Group className={classes.leftBox}>
            <Group className={classes.title}>
              <Text fz="md" td="underline" fs="italic" fw={500}>Story Title:</Text>
            </Group>
            <EditableTitle />
          </Group>
          
          <Divider orientation='vertical' variant='dashed'/>

          <Group className={classes.rightBox}>
            <Group className={classes.buttons}>
              <Saver />
            </Group>
            <Group className={classes.buttons}>
              <Downloader story={story} />
            </Group>
          </Group>
        </Group>

      </Container>
    </>
  );
}


const EditableTitle = () => {
  const dispatch = useAppDispatch();
  const storyTitle = useAppSelector(selectStoryTitle);

  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(storyTitle);

  useEffect(() => {
    setTitle(storyTitle);
  }, [storyTitle]);


  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const onIconClick = (): void => {
    setEditable(true);
  }

  const onSaveClick = (): void => {
    setEditable(false);
    dispatch(setName(title));
    dispatch(saveName());
  }

  if (editable) {
    return (
      <>
        <TextInput value={title} onChange={handleTextChange} disabled={!editable} size="lg" />
        <Button onClick={onSaveClick}>
          Save Title
        </Button>
      </>
    );
  }

  return (
    <>
      {title
        ?
        <Title order={2}> {title} </Title>
        :
        <Text fz="xl" fw={700} fs="italic" c="dimmed">
          Enter your story title
        </Text>
      }

      <ActionIcon variant="filled" size="md" color="blue" onClick={onIconClick}>
        <IconEdit size={20} />
      </ActionIcon>

    </>

  );
}
