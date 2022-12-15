import {
  Pagination,
  Stack,
  Container,
  Group,
  createStyles,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Downloader from "../../../components/generator/Downloader";
import GraphViz from "../../../components/generator/GraphViz";
import Saver from "../../../components/generator/Saver";
import StorySection from "../../../components/generator/StorySection";
import { connectNodes, selectLoadingSection, selectStoryGraph } from "../../../store/features/storySlice";
import { isAction } from "../../../utils/graph/graphUtils";
import { getStoryNodes } from "../../../utils/graph/storyUtils";
import { NodeData, StoryNode } from "../../../utils/graph/types";

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
    padding: 0,
  },
}));

const StoryViz = () => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const storyGraph = useAppSelector(selectStoryGraph);
  const loadingSection = useAppSelector(selectLoadingSection);

  const [activeNodeId, setActiveNodeId] = useState<number | null>(0);


  const story = useMemo(
    () => {
      return getStoryNodes(storyGraph, false);
    },
    [storyGraph]
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
      <Group spacing="xl">

        <GraphViz
          graph={storyGraph}
          setActiveNodeId={setActiveNodeId}
          onConnectNodes={sendConnectNodesMessage}
        />

        <Stack spacing="xl">
          <Saver />
          <Downloader story={story} />
        </Stack>

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
