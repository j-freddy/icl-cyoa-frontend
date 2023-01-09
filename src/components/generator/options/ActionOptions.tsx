import {
  Button,
  createStyles,
  NumberInput,
  Popover,
  Stack
} from "@mantine/core";
import { useCallback, useMemo } from "react";
import { regenerateEnding, regenerateMany, regenerateParagraph, selectGenerateManyDepth, selectLoadingType, setGenerateManyDepth } from "../../../store/features/storySlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ActionNode } from "../../../utils/graph/types";
import DeleteButton from "./DeleteButton";
import { SplitButton } from "./SplitButton";

const useStyles = createStyles((theme) => ({
  buttonStack: {
    textAlign: "center"
  },

}));


interface ActionOptionsProps {
  actionNode: ActionNode,
};

function ActionOptions(props: ActionOptionsProps) {
  const { actionNode } = props;
  
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const loadingType = useAppSelector(selectLoadingType);
  const actionsDisabled = useMemo(() => loadingType !== null, [loadingType]);

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

  const onGenerateEndingClick = (): void => {
    dispatch(regenerateEnding(actionNode.nodeId))
  };

  const onGenerateClick = async () => {
    dispatch(regenerateParagraph(actionNode.nodeId))
  };

  const onGenerateManyClick = async () => {
    dispatch(regenerateMany({
      fromNode: actionNode.nodeId,
    }))
  }


  return (
    <Stack spacing="xs">
      {
        actionNode.childrenIds.length === 0 ? (
          <>
            <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack} onClick={onGenerateClick}>
              Generate Next
            </Button>
            <SplitButton confirmation={false} text="Generate Many" disabled={actionsDisabled} onClick={onGenerateManyClick}>
              <GenerateManyDepthInput />
            </SplitButton>
            <Button disabled={actionsDisabled} variant="outline" className={classes.buttonStack} onClick={onGenerateEndingClick}>
              Generate Ending
            </Button>
          </>
        ) : (
          <>
            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button disabled={actionsDisabled} variant="outline">Regenerate Next</Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Button variant="subtle" className={classes.buttonStack} onClick={onGenerateClick}>
                  Confirm:<br />Regenerate next
                </Button>
              </Popover.Dropdown>
            </Popover>

            <SplitButton confirmation text="Regenerate Many" disabled={actionsDisabled} onClick={onGenerateManyClick}>
              <GenerateManyDepthInput />
            </SplitButton>

            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button disabled={actionsDisabled} variant="outline">Regenerate Ending</Button>
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
    
      <DeleteButton onlyChildren={false} disabled={actionsDisabled} nodeId={actionNode.nodeId} />

    </Stack>
  );
}

export default ActionOptions;
