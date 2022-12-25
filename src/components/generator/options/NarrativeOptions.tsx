import {
  Button,
  createStyles,
  Popover,
  Stack,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { useAppDispatch } from "../../../store/hooks";
import { generateActions, generateMany, regenerateActions, regenerateMany } from "../../../store/features/storySlice";
import { NarrativeNode } from "../../../utils/graph/types";

const useStyles = createStyles((theme) => ({
  buttonStack: {

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
                Confirm: Regenerate
              </Button>
            </Popover.Dropdown>
          </Popover>
          <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button variant="outline">Regenerate Many</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Button variant="subtle" className={classes.buttonStack} onClick={onRegenerateManyClick}>
                Confirm: Regenerate Many
              </Button>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      }
    </>
);
}

export default NarrativeOptions;
