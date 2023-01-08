import {
  Button,
  createStyles,
  NumberInput,
  Popover,
  Stack
} from "@mantine/core";
import { useCallback, useMemo } from "react";
import { generateActions, generateMany, regenerateActions, regenerateMany, generateNewAction, setEnding, selectNumActionsToAdd, setNumActionsToAdd, selectLoadingSection, selectGenerateManyDepth, setGenerateManyDepth } from "../../../store/features/storySlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { NarrativeNode } from "../../../utils/graph/types";
import DeleteButton from "./DeleteButton";
import { SplitButton } from "./SplitButton";

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

  const loadingSection = useAppSelector(selectLoadingSection);
  const actionsDisabled = useMemo(() => loadingSection !== null, [loadingSection]);

  const onAddActionClick = useCallback(() => {
    dispatch(generateNewAction({ nodeToExpand: narrativeNode.nodeId }));
  }, [dispatch, narrativeNode]);

  const onGenerateManyClick = useCallback(() => {
    dispatch(generateMany({ fromNode: narrativeNode.nodeId }));
  }, [dispatch, narrativeNode]);

  const onRegenerateManyClick = useCallback(() => {
    dispatch(regenerateMany({ fromNode: narrativeNode.nodeId }));
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
      return "Add 1 Action";
    };
    return `Add ${numActionsToAdd} Actions`
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

  const generateManyDepth = useAppSelector(selectGenerateManyDepth);

  const GenerateManyDepthInput = useCallback(() => {
    const onChange = (depth: number) => {
      dispatch(setGenerateManyDepth(depth));
    };

    return (
      <NumberInput 
        size="xs" 
        defaultValue={generateManyDepth} 
        label="Depth to generate:" 
        onChange={onChange}
        max={3}
        min={1}
      />
    )
  }, [dispatch, generateManyDepth]);

  if (narrativeNode.isEnding) {
    return (
      <Stack spacing="xs">
        <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack} onClick={onMakeNonEnding}>
          Make non-ending
        </Button>
        {narrativeNode.nodeId !== 0 && <DeleteButton onlyChildren={false} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />}
      </Stack>
    )
  }

  return (
    <Stack spacing="xs">
      <SplitButton confirmation={false} text={numActionsButtonText} disabled={actionsDisabled} onClick={onAddActionClick}>
        <AddActionNumberInput />
      </SplitButton>
    {narrativeNode.childrenIds.length === 0
        ?
        // Generate & Generate Many
        <>
          <SplitButton confirmation={false} text="Generate Many" disabled={actionsDisabled} onClick={onGenerateManyClick}>
            <GenerateManyDepthInput />
          </SplitButton>
          <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack} onClick={onMakeEnding}>
            Make ending
          </Button>
        </>
        :
        // Regenerate
        <>
          <SplitButton confirmation text="Regenerate Many" disabled={actionsDisabled} onClick={onRegenerateManyClick}>
            <GenerateManyDepthInput />
          </SplitButton>
        </>
      }
      {narrativeNode.nodeId !== 0 && <DeleteButton onlyChildren={false} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />}
      {narrativeNode.childrenIds.length !== 0 && <DeleteButton onlyChildren={true} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />}
    </Stack>
  );
}

export default NarrativeOptions;
