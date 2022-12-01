import {
  Text,
  createStyles,
  Group,
  Box,
} from '@mantine/core';
import { Handle, NodeProps, Position } from 'reactflow';
import { getPreview } from '../../../utils/graph/graphUtils';
import { ActionNode } from '../../../utils/graph/types';
import ActionOptions from '../options/ActionOptions';

const boxSize = {
  width: 172,
  height: 64,
};

const useStyles = createStyles((theme) => ({

  nodeBox: {
    // theme.colors.gray[0] -> #f8f9fa ->
    backgroundColor: "rgba(248, 249, 250, 0.2)",
    border: `2px solid ${theme.colors.gray[0]}`,
    textAlign: 'center',
    padding: theme.spacing.xs,
    maxWidth: boxSize.width,
    maxHeight: boxSize.height,
    fontSize: "10px",
    overflow: "hidden",

    '&:hover': {
      cursor: "pointer",
    },
  },
}));


interface ActionFlowNodeData {
  actionNode: ActionNode,
};

function ActionFlowNode(props: NodeProps<ActionFlowNodeData>) {
  const { classes } = useStyles();

  const {
    data: {
      actionNode,
    },
    targetPosition,
    sourcePosition,
  } = props;

  const NUM_WORDS = 6;
  const preview: string = getPreview(actionNode.data, NUM_WORDS);

  return (
    <Box className={classes.nodeBox}>
      <Handle type="target" position={targetPosition || Position.Top} />
      <Group noWrap={true} align="top">
        <Text>
          {preview}
        </Text>
        <ActionOptions actionNode={actionNode} />
      </Group>
      {
        actionNode.childrenIds.length !== 0 &&
        <Handle type="source" position={sourcePosition || Position.Bottom} />
      }
    </Box>
  );
}

export default ActionFlowNode;
