import {
  Pagination,
  Container,
  Group,
  createStyles,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import GraphViz from "../../../components/generator/GraphViz";
import StorySection from "../../../components/generator/StorySection";
import { connectNodes, selectLoadingSection, selectStoryGraph } from "../../../store/features/storySlice";
import { isAction } from "../../../utils/graph/graphUtils";
import { getStoryNodes } from "../../../utils/graph/storyUtils";
import { NodeData, StoryNode } from "../../../utils/graph/types";
import NodeOptions from "../../../components/generator/options/NodeOptions";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    padding: 0,
  },

  group: {
    alignItems: "stretch",
  },

  optionsContainer: {
    width: "240px",
    height: "400px",
    border: "2px solid var(--my-light)",
    background: "var(--my-light)",
    borderRadius: "8px",
    marginBottom: "var(--grid-size)",
    padding: "var(--grid-size)",
  },
}));

const StoryViz = () => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const storyGraph = useAppSelector(selectStoryGraph);
  const loadingSection = useAppSelector(selectLoadingSection);

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);


  const story = useMemo(() => {
      return getStoryNodes(storyGraph, false);
    }, [storyGraph]
  );

  const sendConnectNodesMessage = useCallback(
    (fromNode: number, toNode: number) => {
      // Block if there are other requests.
      if (loadingSection !== null)
        return;

      dispatch(connectNodes({ fromNode: fromNode, toNode: toNode }))
    },
    [dispatch, loadingSection]
  );

  const activeSectionId = useMemo(
    () => {
      if (activeNodeId === null) {
        return 0;
      }

      const node: NodeData = storyGraph.nodeLookup[activeNodeId];

      if (isAction(node)) {
        const parentNarrativeNode = Object.values(storyGraph.nodeLookup)
          .find((parent: NodeData) => parent.childrenIds.includes(activeNodeId))!
        return story.find((node) => node.nodeId === parentNarrativeNode.nodeId)!.sectionId;
      }

      return story.find((storyNode) => storyNode.nodeId === node.nodeId)!.sectionId;
    },
    [story, activeNodeId]
  );

  const setActiveSectionId = useCallback(
    (page: number) => {
      const storyNode: StoryNode = story.find((storyNode) => storyNode.sectionId === page)!
      setActiveNodeId(storyNode.nodeId);
    },
    [story, setActiveNodeId]
  )


  return (
    <Container className={classes.container}>
      <Group spacing="xl" className={classes.group}>

        <GraphViz
          graph={storyGraph}
          setActiveNodeId={setActiveNodeId}
          onConnectNodes={sendConnectNodesMessage}
        />

        <Container className={classes.optionsContainer}>
          {
            activeNodeId !== null && 
            <NodeOptions nodeData={storyGraph.nodeLookup[activeNodeId!]} />
          }
        </Container>

      </Group>

      <Pagination
        page={activeSectionId}
        onChange={setActiveSectionId}
        total={story.length}
        siblings={3}
        position="center"
        radius="lg"
        withEdges
      />
      <StorySection {...story.find((storyNode) => storyNode.sectionId === activeSectionId)!} />

    </Container>
  );
}


export default StoryViz;
