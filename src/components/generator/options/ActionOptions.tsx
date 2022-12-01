import {
  ActionIcon,
  createStyles,
  Popover,
  Stack,
  UnstyledButton
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { useAppDispatch } from "../../../app/hooks";
import { generateEnding, generateParagraph, regenerateParagraph } from "../../../features/storySlice";
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


  const onGenerateClick = (): void => {
    dispatch(generateParagraph({ nodeToExpand: actionNode.nodeId }));
  };
  const onGenerateEndingClick = (): void => {
    dispatch(generateEnding({ nodeToEnd: actionNode.nodeId }))
  };
  const onRegenerateClick = async () => {
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
          {
            actionNode.childrenIds.length === 0
              ?
              <UnstyledButton className={classes.buttonStack} onClick={onGenerateClick}>
                Generate
              </UnstyledButton>
              :
              <UnstyledButton className={classes.buttonStack} onClick={onRegenerateClick}>
                Regenerate
              </UnstyledButton>
          }
          <UnstyledButton className={classes.buttonStack} onClick={onGenerateEndingClick}>
            Generate Ending
          </UnstyledButton>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default ActionOptions;
