import {
  Text,
  createStyles,
  Group,
  Box,
} from '@mantine/core';
import { Handle, NodeProps, Position } from 'reactflow';
import { getPreview } from '../../../utils/graph/graphUtils';
import { NarrativeNode } from '../../../utils/graph/types';
import NarrativeOptions from '../options/NarrativeOptions';

const boxSize = {
  width: 172,
  height: 64,
};

const useStyles = createStyles((theme) => ({

  nodeBox: {
    backgroundColor: theme.colors.gray[0],
    textAlign: 'center',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    maxWidth: boxSize.width,
    maxHeight: boxSize.height,
    fontSize: "10px",
    overflow: "hidden",

    '&:hover': {
			cursor: "pointer",
		},
  },
}));


interface NarrativeFlowNodeData {
  narrativeNode: NarrativeNode,
};

function NarrativeFlowNode(props: NodeProps<NarrativeFlowNodeData>) {
  const { classes } = useStyles();

  const {
    data: {
      narrativeNode,
    },
    targetPosition,
    sourcePosition,
  } = props;

  const NUM_WORDS = 8;
  const preview: string = getPreview(narrativeNode.data, NUM_WORDS);

  return (
    <Box className={classes.nodeBox}>
      {
        narrativeNode.nodeId !== 0 &&
        <Handle type="target" position={targetPosition || Position.Top} />
      }
      <Group noWrap={true} align="top">
        <Text>
          {preview}
        </Text>
        <NarrativeOptions narrativeNode={narrativeNode} />
      </Group>
      {
        narrativeNode.childrenIds.length !== 0 &&
        <Handle type="source" position={sourcePosition || Position.Bottom} />
      }
    </Box>
  );
}

export default NarrativeFlowNode;
