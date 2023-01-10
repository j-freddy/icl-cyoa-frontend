import {
  Button,
  createStyles,
  NumberInput, Stack
} from "@mantine/core";
import { generateMany, generateNewAction, regenerateMany, selectGenerateManyDepth, selectGraphIsBeingEdited, selectGraphIsLoading, selectNumActionsToAdd, setEnding, setGenerateManyDepth, setNumActionsToAdd } from "../../../store/features/storySlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { NarrativeNode } from "../../../utils/graph/types";
import DeleteButton from "./buttons/DeleteButton";
import SplitButton from "./buttons/SplitButton";

const useStyles = createStyles((theme) => ({

  buttonStack: {
    textAlign: "center"
  },
}));


interface NarrativeOptionsProps {
  narrativeNode: NarrativeNode,
};

function NarrativeOptions(props: NarrativeOptionsProps) {
  const { narrativeNode } = props;

  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const graphIsLoading = useAppSelector(selectGraphIsLoading);
  const graphIsBeingEdited = useAppSelector(selectGraphIsBeingEdited);
  const numActionsToAdd = useAppSelector(selectNumActionsToAdd);
  const generateManyDepth = useAppSelector(selectGenerateManyDepth);

  const actionsDisabled = graphIsLoading || graphIsBeingEdited;


  /****************************************************************
  **** Functions.
  ****************************************************************/

  const onAddActionClick = () => {
    dispatch(generateNewAction({ nodeToExpand: narrativeNode.nodeId }));
  }

  const onGenerateManyClick = () => {
    dispatch(generateMany({ fromNode: narrativeNode.nodeId }));
  }

  const onRegenerateManyClick = () => {
    dispatch(regenerateMany({ fromNode: narrativeNode.nodeId }));
  }

  const onMakeEnding = () => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: true }));
  }

  const onMakeNonEnding = () => {
    dispatch(setEnding({ nodeId: narrativeNode.nodeId, isEnding: false }));
  }


  /****************************************************************
  **** Components.
  ****************************************************************/

  const numActionsButtonText = numActionsToAdd === 1
    ? "Add 1 Action"
    : `Add ${numActionsToAdd} Actions`;

  const AddActionNumberInput = () => {
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
  }

  const GenerateManyDepthInput = () => {
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
    );
  }

  const NoChildrenButtons = () => {
    return (
      /* Generate & Generate Many */
      <>
        <SplitButton confirmation={false} text="Generate Many" disabled={actionsDisabled}
          onClick={onGenerateManyClick}
        >
          <GenerateManyDepthInput />
        </SplitButton>

        <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack}
          onClick={onMakeEnding}
        >
          Make ending
        </Button>
      </>
    );
  }

  const WithChildrenButtons = () => {
    return (
      /* Regenerate */
      <>
        <SplitButton confirmation text="Regenerate Many" disabled={actionsDisabled}
          onClick={onRegenerateManyClick}
        >
          <GenerateManyDepthInput />
        </SplitButton>
      </>
    );
  }


  /****************************************************************
  **** Return.
  ****************************************************************/

  if (narrativeNode.isEnding) {
    return (
      <Stack spacing="xs">
        <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack}
          onClick={onMakeNonEnding}
        >
          Make non-ending
        </Button>

        {narrativeNode.nodeId !== 0 &&
          <DeleteButton onlyChildren={false} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />
        }
      </Stack>
    );
  }

  return (
    <Stack spacing="xs">
      <SplitButton confirmation={false} text={numActionsButtonText} disabled={actionsDisabled}
        onClick={onAddActionClick}
      >
        <AddActionNumberInput />
      </SplitButton>

      {narrativeNode.childrenIds.length === 0
        ? <NoChildrenButtons />
        : <WithChildrenButtons />
      }

      {narrativeNode.nodeId !== 0 &&
        <DeleteButton onlyChildren={false} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />
      }

      {narrativeNode.childrenIds.length !== 0 &&
        <DeleteButton onlyChildren={true} disabled={actionsDisabled} nodeId={narrativeNode.nodeId} />
      }
    </Stack>
  );
}

export default NarrativeOptions;
