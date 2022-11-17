import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../api/server';
import { deleteNodeFromGraph, graphMessageToGraphLookup } from '../graph/graphUtils';
import { Graph, GraphMessage, LoadingType } from '../graph/types';

interface StoryState {
  graph: Graph;
  // Queues are non-serialisable
  // This is OK as it is impractical for the user to
  // click 'Generate' thousands of times
  loadingSection: LoadingType | null;
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

const initialState: StoryState = {
  graph: { nodeLookup: {} },
  loadingSection: null,
};

export const generateStartParagraph = createAsyncThunk(
  'story/generateStartParagraph',
  async (prompt: string) => {
    const response = await API.generateStartParagraph(prompt);
    const json = await response.json();
    return json;
  }
);

export const generateParagraph = createAsyncThunk(
  'story/generateParagraph',
  async (nodeToExpand: number, { getState }) => {
    const state = getState() as { story: StoryState }
    const response = await API.generateParagraph(state.story.graph, nodeToExpand);
    const json = await response.json();

    return json;
  }
);

export const generateActions = createAsyncThunk(
  'story/generateActions',
  async (nodeToExpand: number, { getState }) => {
    const state = getState() as { story: StoryState }
    const response = await API.generateActions(state.story.graph, nodeToExpand);
    const json = await response.json();

    return json;
  }
);

export const generateEnding = createAsyncThunk(
  'story/generateEnding',
  async (nodeToEnd: number, { getState }) => {
    const state = getState() as { story: StoryState }
    const response = await API.endPath(state.story.graph, nodeToEnd);
    const json = await response.json();

    return json;
  }
);

export const regenerateParagraph = createAsyncThunk(
  'story/regenerateParagraph',
  async (nodeToRegenerate: number, { dispatch }) => {
    dispatch(deleteNode(nodeToRegenerate))
    await dispatch(generateParagraph(nodeToRegenerate))
  }
);

export const regenerateActions = createAsyncThunk(
  'story/regenerateActions',
  async (nodeToRegenerate: number, { dispatch }) => {
    dispatch(deleteNode(nodeToRegenerate))
    await dispatch(generateActions(nodeToRegenerate))
  }
);

export const connectNodes = createAsyncThunk(
  'story/connectNodes',
  async (data: { fromNode: number, toNode: number }, { getState }) => {
    const { fromNode, toNode } = data;
    const state = getState() as { story: StoryState }
    const response = await API.connectNodes(state.story.graph, fromNode, toNode);
    const json = await response.json();

    return json;
  }
);

const handleRequest = (loadingType: LoadingType) => {
  return (state: StoryState) => {
    state.loadingSection = loadingType;
  }
};

const handleResponse = (state: StoryState, action: PayloadAction<{graph: GraphMessage}>) => {
  state.graph = graphMessageToGraphLookup(action.payload.graph);
  state.loadingSection = null;
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    reset: () => initialState,
    setGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
    },
    deleteNode: (state, action: PayloadAction<number>) => {
      state.graph = deleteNodeFromGraph(state.graph, action.payload)
    },
    setNodeData: (state, action: PayloadAction<{nodeId: number, data: string}>) => {
      state.graph.nodeLookup[action.payload.nodeId].data = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateParagraph.pending, handleRequest(LoadingType.GenerateParagraph));
    builder.addCase(generateParagraph.fulfilled, handleResponse);

    builder.addCase(generateActions.pending, handleRequest(LoadingType.GenerateActions));
    builder.addCase(generateActions.fulfilled, handleResponse);

    builder.addCase(generateEnding.pending, handleRequest(LoadingType.GenerateEnding));
    builder.addCase(generateEnding.fulfilled, handleResponse);

    builder.addCase(connectNodes.pending, handleRequest(LoadingType.ConnectingNodes));
    builder.addCase(connectNodes.fulfilled, handleResponse);

    builder.addCase(generateStartParagraph.pending, handleRequest(LoadingType.InitialStory));
    builder.addCase(generateStartParagraph.fulfilled, handleResponse);
  },
});


export const {
  reset,
  setGraph,
  deleteNode,
  setNodeData,
} = storySlice.actions;

export default storySlice.reducer;
