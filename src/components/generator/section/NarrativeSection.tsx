import {
  ActionIcon, createStyles, Group, Text, Textarea
} from '@mantine/core';
import { IconCheckbox, IconEdit } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { setNodeData } from '../../../store/features/storySlice';
import { useAppDispatch } from '../../../store/hooks';
import { StoryNode } from '../../../utils/graph/types';


const useStyles = createStyles((theme) => ({
  paragraph: {
    color: theme.black,
    wordBreak: 'break-all',
  },

  text_input: {
    width: "100%",
    numberOfLines: 5
  }
}));


interface NarrativeSectionProps extends StoryNode { };

const NarrativeSection = (props: NarrativeSectionProps) => {
  const { classes } = useStyles();
  const [text, setText] = useState(props.paragraph);

  useEffect(() => setText(props.paragraph), [props.paragraph]);

  const [editable, changeEditable] = useState(false);

  const dispatch = useAppDispatch();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const onEditClick = (): void => {
    changeEditable(true);
  };

  const onDoneClick = (): void => {
    dispatch(setNodeData({ nodeId: props.nodeId, data: text }));
    changeEditable(false);
  };


  if (editable) {
    return (
      <Group noWrap={true} align="top">
        <Textarea
          size="md"
          autosize
          minRows={2}
          maxRows={6}
          value={text}
          onChange={handleTextChange}
          className={classes.text_input}
        />
        <ActionIcon onClick={onDoneClick}>
          <IconCheckbox color="blue" />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <Group noWrap={true} align="top">
      <Text className={classes.paragraph}>
        {props.paragraph}
      </Text>
      <ActionIcon onClick={onEditClick}>
        <IconEdit />
      </ActionIcon>
    </Group>
  );
};

export default NarrativeSection;
