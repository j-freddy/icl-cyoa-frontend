import {
  Button,
  createStyles,
  Popover,
  Stack
} from "@mantine/core";
import { regenerateEnding, regenerateMany, regenerateParagraph } from "../../../store/features/storySlice";
import { useAppDispatch } from "../../../store/hooks";
import { ActionNode } from "../../../utils/graph/types";
import DeleteButton from "./DeleteButton";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    textAlign: "center"
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

  const onGenerateManyClick = async () => {
    dispatch(regenerateMany({
      fromNode: actionNode.nodeId,
      // TODO Customisable max depth
      maxDepth: 2,
    }))
  }


  return (
    <Stack spacing="xs">
      {
        actionNode.childrenIds.length === 0 ? (
          <>
            <Button variant="outline" className={classes.buttonStack} onClick={onGenerateClick}>
              Generate
            </Button>
            <Button variant="outline" className={classes.buttonStack} onClick={onGenerateManyClick}>
              Generate Many
            </Button>
            <Button variant="outline" className={classes.buttonStack} onClick={onGenerateEndingClick}>
              Generate Ending
            </Button>
          </>
        ) : (
          <>
            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button variant="outline">Regenerate </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Button variant="subtle" className={classes.buttonStack} onClick={onGenerateClick}>
                  Confirm:<br />Regenerate
                </Button>
              </Popover.Dropdown>
            </Popover>

            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button variant="outline">Regenerate Many</Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Button variant="subtle" className={classes.buttonStack} onClick={onGenerateManyClick}>
                  Confirm:<br />Regenerate Many
                </Button>
              </Popover.Dropdown>
            </Popover>

            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button variant="outline">Regenerate Ending</Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Button variant="subtle" className={classes.buttonStack} onClick={onGenerateEndingClick}>
                  Confirm:<br />Regenerate Ending
                </Button>
              </Popover.Dropdown>
            </Popover>
          </>
        )
      }
    
      <DeleteButton nodeId={actionNode.nodeId} />

    </Stack>
  );
}

export default ActionOptions;
