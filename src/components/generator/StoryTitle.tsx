import {
  ActionIcon, Button, Container, createStyles,
  Group, Text, Textarea,
  Title
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { saveName, selectStoryTitle, setName } from '../../store/features/storySlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';


const useStyles = createStyles((theme) => ({

  titleBox: {
    backgroundColor: theme.colors.gray[0],
    textAlign: 'center',
    padding: theme.spacing.md,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: theme.radius.sm,
    width: "100%",
  },
  title: {
    width: "100%",
    alignItems: 'center'
  }

}));


export default function StoryTitle() {
  const { classes } = useStyles();

  return (
    <>
      <Container size="xl" className={classes.titleBox}>
        <Group className={classes.title}>
          <Text fz="md" td="underline" fs="italic" fw={500}>Story Title:</Text>
        </Group>
        <TitleGroup />
      </Container>
    </>
  );
}


const TitleGroup = () => {
  const dispatch = useAppDispatch();
  const storyTitle = useAppSelector(selectStoryTitle);

  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(storyTitle);

  useEffect(() => {
    setTitle(storyTitle);
  }, [storyTitle]);


  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
      <Group mt={10} spacing={20} align="center" position="apart">
        <Textarea value={title} onChange={handleTextChange} disabled={!editable} autosize />
        <Button onClick={onSaveClick}>
          Save Title
        </Button>
      </Group>
    );
  }

  return (
    <Group mt={10} spacing={50} align="center" position="apart">
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
    </Group>

  );
}
