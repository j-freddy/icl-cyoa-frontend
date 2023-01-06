import {
  Button,
  createStyles,
  Popover,
  Stack
} from "@mantine/core";
import { generateActions, generateMany, regenerateActions, regenerateMany, setEnding } from "../../../store/features/storySlice";
import { useAppDispatch } from "../../../store/hooks";
import { NarrativeNode } from "../../../utils/graph/types";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    textAlign: "center"
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

  const onGenerateManyClick = () => {
    dispatch(generateMany({
      fromNode: narrativeNode.nodeId,
      // TODO Customisable max depth
      maxDepth: 2,
    }));
  };

  const onRegenerateManyClick = () => {
    dispatch(regenerateMany({
      fromNode: narrativeNode.nodeId,
      // TODO Customisable max depth
      maxDepth: 2,
    }));
  }

  const onMakeEnding = () => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: true }));
  }

  const onMakeNonEnding = () => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: false }));
  }

  if (narrativeNode.isEnding) {
    return (
      <Stack spacing="xs">
        <Button variant="outline" className={classes.buttonStack} onClick={onMakeNonEnding}>
          Make non-ending
        </Button>
    </Stack>
    )
  }

  return (
    <>
      {narrativeNode.childrenIds.length === 0
        ?
        // Generate & Generate Many
        <Stack spacing="xs">
          <Button variant="outline" className={classes.buttonStack} onClick={onGenerateClick}>
            Generate
          </Button>
          <Button variant="outline" className={classes.buttonStack} onClick={onGenerateManyClick}>
            Generate Many
          </Button>
          <Button variant="outline" className={classes.buttonStack} onClick={onMakeEnding}>
            Make ending
          </Button>
        </Stack>
        :
        // Regenerate
        <Stack spacing="xs">
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button variant="outline">Regenerate</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Button variant="subtle" className={classes.buttonStack} onClick={onRegenerateClick}>
                Confirm:<br />Regenerate
              </Button>
            </Popover.Dropdown>
          </Popover>
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button variant="outline">Regenerate Many</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Button variant="subtle" className={classes.buttonStack} onClick={onRegenerateManyClick}>
                Confirm:<br />Regenerate Ending
              </Button>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      }
    </>
);
}

export default NarrativeOptions;
