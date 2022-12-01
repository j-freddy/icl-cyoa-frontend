import {
  Text,
  Group,
  ActionIcon,
  Textarea,
  createStyles,
} from '@mantine/core';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setNodeData } from '../../../features/storySlice';
import { IconEdit, IconCheckbox } from '@tabler/icons';


const useStyles = createStyles((theme) => ({
  action: {
    color: theme.black,
  },

  text_input: {
    width: "100%",
    numberOfLines: 5
  }
}));


interface ActionSectionProps {
  nodeId: number,
  action: string,
};

const ActionSection = (props: ActionSectionProps) => {
  const { classes } = useStyles();
  const [action, setAction] = useState(props.action);
  const [editable, changeEditable] = useState(false);

  const dispatch = useAppDispatch();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setAction(event.target.value);
  };

  const onEditClick = (): void => {
    changeEditable(true);
  };

  const onDoneClick = (): void => {
    dispatch(setNodeData({ nodeId: props.nodeId, data: action }));
    changeEditable(false);
  };

  return (
    <>
      {
        editable
          ?
          <Group noWrap={true} align="top">
            <Textarea
              size="md"
              autosize
              minRows={2}
              maxRows={6}
              value={action}
              onChange={handleTextChange}
              className={classes.text_input}
            />
            <ActionIcon onClick={onDoneClick}>
              <IconCheckbox color="blue" />
            </ActionIcon>
          </Group>
          :
          <Group noWrap={true} align="top">
            <Text className={classes.action}>
              {action}
            </Text>
            <ActionIcon onClick={onEditClick}>
              <IconEdit />
            </ActionIcon>
          </Group>

      }
    </>
  );
};

export default ActionSection;
