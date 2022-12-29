import {
  createStyles,
  Center,
  Container,
  Slider,
  Space,
} from '@mantine/core';
import { getPreview, isNarrative } from '../../../utils/graph/graphUtils';
import { ActionNode, NarrativeNode, NodeData, NodeType } from '../../../utils/graph/types';
import NarrativeOptions from './NarrativeOptions';
import { ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons';
import ActionOptions from './ActionOptions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setTemperature } from '../../../store/features/storySlice';
import ActionAdvancedOptions from './ActionAdvancedOptions';

const useStyles = createStyles((theme) => ({
  slider: {
    paddingBottom: "2em",
    marginLeft: "8px",
    marginRight: "8px",
  },
  textarea: {
    paddingBottom: "1em"
  }
}));

const NUM_WORDS = 12;

function typeToString(type: NodeType) {
  return type == NodeType.Narrative ? "Paragraph" : "Action";
}

type NodeOptionsProps = {
  nodeData: NodeData,
};

const NodeOptions = (props: NodeOptionsProps) => {

  const temperature = useAppSelector((state) => state.story.temperature);

  const dispatch = useAppDispatch();

  const { classes } = useStyles();

  return (
    <Container px={0}>
      <Center>
        <ActionIcon size="xl">
          <IconSettings size={34} />
        </ActionIcon>
      </Center>

      <b>Selected: {typeToString(props.nodeData.type)}</b>
      <p>
        {getPreview(props.nodeData.data, NUM_WORDS)}
      </p>

      {
        isNarrative(props.nodeData) ? (
          <NarrativeOptions narrativeNode={props.nodeData as NarrativeNode} />
        ) : (
          <ActionOptions actionNode={props.nodeData as ActionNode} />
        )
      }

      <Space h="sm"></Space>

      <b>Advanced options: </b>

      {
        !isNarrative(props.nodeData) && <ActionAdvancedOptions />
      }

      <p>Creativity: </p>
      <Slider 
        className={classes.slider}
        value={temperature}
        onChange={(t) => dispatch(setTemperature(t))}
        min={0}
        max={1}
        step={0.2}
        label={(value) => value.toFixed(1)}
        marks={[
          { value: 0, label: "0"},
          { value: 0.2 }, 
          { value: 0.4 }, 
          { value: 0.6 },
          { value: 0.8 },
          { value: 1, label: "1"},
        ]}
      />
    </Container>
  );
};

export default NodeOptions;
