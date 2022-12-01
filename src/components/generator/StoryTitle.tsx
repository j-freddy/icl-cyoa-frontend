import { 
  ActionIcon, 
  Text, 
  Button, 
  createStyles, 
  Group, 
  Textarea, 
  Title, 
  Container 
} from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { saveName, selectStoryTitle, setName } from '../../features/storySlice';


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


function StoryTitle () {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const storyTitle = useAppSelector(selectStoryTitle);

  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(storyTitle);

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

  return (
    <>
      <Container size="xl" className={classes.titleBox}>
        <Group className={classes.title}>
          <Text fz="md" td="underline" fs="italic" fw={500}>Story Title:</Text>
        </Group>

        {editable
          ?
          <Group mt={10} spacing={20} align="center" position="apart">
            <Textarea
              value={title}
              onChange={handleTextChange}
              disabled={!editable}
              autosize

            />
            <Button onClick={onSaveClick}>
              Save Title
            </Button>
          </Group>
          :
          <Group mt={10} spacing={50} align="center" position="apart">
            {
              title
                ?
                <Title order={2}>
                  {title}
                </Title>
                :
                <Text fz="xl" fw={700} fs="italic" c="dimmed">
                  Enter your story title
                </Text>
            }

            <ActionIcon
              variant="filled"
              size="md"
              color="blue"
              onClick={onIconClick}>
              <IconEdit size={20} />
            </ActionIcon>
          </Group>
        }
      </Container>
    </>
  );
}

export default StoryTitle;
