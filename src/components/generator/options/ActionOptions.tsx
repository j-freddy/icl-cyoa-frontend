import {
  ActionIcon,
  createStyles,
  Popover,
  Stack,
  UnstyledButton
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { useAppDispatch } from "../../../store/hooks";
import { regenerateEnding, regenerateParagraph } from "../../../store/features/storySlice";
import { ActionNode } from "../../../utils/graph/types";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    fontSize: "10px",
    '&:hover': {
      fontWeight: "bold",
    },
  },

}));


interface ActionOptionsProps {
  actionNode: ActionNode,
};

function ActionOptions(props: ActionOptionsProps) {
  const { classes } = useStyles();

  const { actionNode } = props;

  const dispatch = useAppDispatch();

  const onGenerateEndingClick = (): void => {
    dispatch(regenerateEnding(actionNode.nodeId))
  };

  const onGenerateClick = async () => {
    dispatch(regenerateParagraph(actionNode.nodeId))
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
          <UnstyledButton className={classes.buttonStack} onClick={onGenerateClick}>
            {actionNode.childrenIds.length === 0
              ? "Generate"
              : "Regenerate"
            }
          </UnstyledButton>
          <UnstyledButton className={classes.buttonStack} onClick={onGenerateEndingClick}>
            {actionNode.childrenIds.length === 0
              ? "Generate ending"
              : "Regenerate ending"
            }
          </UnstyledButton>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default ActionOptions;
