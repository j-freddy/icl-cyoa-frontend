import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Menu,
  NumberInput,
  Popover,
  Stack
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons";
import { useCallback, useMemo } from "react";
import { generateActions, generateMany, regenerateActions, regenerateMany, generateNewAction, setEnding, selectNumActionsToAdd, setNumActionsToAdd } from "../../../store/features/storySlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { NarrativeNode } from "../../../utils/graph/types";
import DeleteButton from "./DeleteButton";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    textAlign: "center"
  },
  splitButton: {
    width: "100%",
    textAlign: "center",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: `0.5px solid`,
  },

  splitMenu: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    // border: 0,
    borderLeft: `0.5px solid`,
  },

}));


interface NarrativeOptionsProps {
  narrativeNode: NarrativeNode,
};

function NarrativeOptions(props: NarrativeOptionsProps) {

  const { classes } = useStyles();

  const { narrativeNode } = props;

  const dispatch = useAppDispatch();

  const onGenerateClick = useCallback(() => {
    dispatch(generateActions({ nodeToExpand: narrativeNode.nodeId }));
  }, [dispatch, narrativeNode]);

  const onRegenerateClick = useCallback(() => {
    dispatch(regenerateActions(narrativeNode.nodeId));
  }, [dispatch, narrativeNode]);

  const onAddActionClick = useCallback(() => {
    dispatch(generateNewAction({ nodeToExpand: narrativeNode.nodeId }));
  }, [dispatch, narrativeNode]);

  const onGenerateManyClick = useCallback(() => {
    dispatch(generateMany({
      fromNode: narrativeNode.nodeId,
      // TODO Customisable max depth
      maxDepth: 2,
    }));
  }, [dispatch, narrativeNode]);

  const onRegenerateManyClick = useCallback(() => {
    dispatch(regenerateMany({
      fromNode: narrativeNode.nodeId,
      // TODO Customisable max depth
      maxDepth: 2,
    }));
  }, [dispatch, narrativeNode]);

  const onMakeEnding = useCallback(() => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: true }));
  }, [dispatch, narrativeNode]);

  const onMakeNonEnding = useCallback(() => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: false }));
  }, [dispatch, narrativeNode]);

  const numActionsToAdd = useAppSelector(selectNumActionsToAdd);
  const numActionsButtonText = useMemo(() => {
    if (numActionsToAdd === 1) {
      return "Add 1 action";
    };
    return `Add ${numActionsToAdd} actions`
  }, [numActionsToAdd]);

  const AddActionNumberInput = useCallback(() => {
    const onChange = (newNumber: number) => {
      dispatch(setNumActionsToAdd(newNumber));
    };

    return (
      <NumberInput 
        size="xs" 
        defaultValue={numActionsToAdd} 
        label="Number of options:" 
        onChange={onChange}
        max={10}
        min={1}
      />
    )
  }, [dispatch, numActionsToAdd]);

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
    <Stack spacing="xs">
    {narrativeNode.childrenIds.length === 0
        ?
        // Generate & Generate Many
        <>
          <Button variant="outline" className={classes.buttonStack} onClick={onGenerateClick}>
            Generate Actions
          </Button>
          <Button variant="outline" className={classes.buttonStack} onClick={onGenerateManyClick}>
            Generate Many
          </Button>
          <Button variant="outline" className={classes.buttonStack} onClick={onMakeEnding}>
            Make ending
          </Button>
        </>
        :
        // Regenerate
        <>
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
        </>
      }
      <Group noWrap spacing={0} position="center">
        <Button variant="outline" className={classes.splitButton} onClick={onAddActionClick}>{numActionsButtonText}</Button>
        <Popover position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon
              variant="outline"
              size={36}
              className={classes.splitMenu}
            >
              <IconChevronDown size={16} stroke={1.5} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown >
            <AddActionNumberInput />
          </Popover.Dropdown>
        </Popover>
      </Group>

      {narrativeNode.nodeId !== 0 && <DeleteButton nodeId={narrativeNode.nodeId} />}
    </Stack>
  );
}

export default NarrativeOptions;
