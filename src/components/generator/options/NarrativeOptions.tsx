import {
  ActionIcon,
  createStyles,
  Popover,
  Stack,
  UnstyledButton
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { useAppDispatch } from "../../../store/hooks";
import { generateActions, regenerateActions } from "../../../store/features/storySlice";
import { NarrativeNode } from "../../../utils/graph/types";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    fontSize: "10px",
    '&:hover': {
      fontWeight: "bold",
    },
  },

}));


interface NarrativeOptionsProps {
  narrativeNode: NarrativeNode,
};

function NarrativeOptions(props: NarrativeOptionsProps) {

  const { classes } = useStyles();

  const { narrativeNode } = props;

  const dispatch = useAppDispatch();


  const onGenerateClick = () => {
    dispatch(generateActions({ nodeToExpand: narrativeNode.nodeId }));
  };
  const onRegenerateClick = () => {
    dispatch(regenerateActions(narrativeNode.nodeId));
  };


  return (
    <Popover trapFocus withArrow shadow="md" zIndex={100}>
      <Popover.Target>
        <ActionIcon >
          <IconMenu2 />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {narrativeNode.childrenIds.length === 0
            ?
            <UnstyledButton className={classes.buttonStack} onClick={onGenerateClick}>
              Generate
            </UnstyledButton>
            :
            <UnstyledButton className={classes.buttonStack} onClick={onRegenerateClick}>
              Regenerate
            </UnstyledButton>
          }
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default NarrativeOptions;
