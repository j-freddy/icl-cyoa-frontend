import {
  createStyles,
  Center,
  Container,
  Title,
  Space,
} from '@mantine/core';
import { getPreview, isNarrative } from '../../../utils/graph/graphUtils';
import { ActionNode, NarrativeNode, NodeData, NodeType } from '../../../utils/graph/types';
import NarrativeOptions from './NarrativeOptions';
import { ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons';
import ActionOptions from './ActionOptions';

const useStyles = createStyles((theme) => ({

}));

const NUM_WORDS = 12;

function typeToString(type: NodeType) {
  return type == NodeType.Narrative ? "Paragraph" : "Action";
}

type NodeOptionsProps = {
  nodeData: NodeData,
};

const NodeOptions = (props: NodeOptionsProps) => {
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
    </Container>
  );
};

export default NodeOptions;
