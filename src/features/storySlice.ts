import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { reqGetStory, reqInitStory, reqSaveGraph, reqSaveName } from '../api/restRequests';
import { RootState } from '../app/store';
import { graphMessageToGraphLookup, deleteNodeFromGraph } from '../utils/graph/graphUtils';
import { Graph, LoadingType, GraphMessage } from '../utils/graph/types';
import { loadStories } from './accountSlice';

interface StoryState {
  id: string;

  name: string;
  graph: Graph;
  // Queues are non-serialisable
  // This is OK as it is impractical for the user to
  // click 'Generate' thousands of times
  loadingSection: LoadingType | null;

  goToGenerator: boolean;
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

const initialState: StoryState = {
  id: "",
  name: "",
  graph: { nodeLookup: {} },
  loadingSection: null,

  goToGenerator: false,
};

export const regenerateParagraph = createAsyncThunk(
  'story/regenerateParagraph',
  async (nodeToRegenerate: number, { dispatch }) => {
    dispatch(deleteNode(nodeToRegenerate));
    await dispatch(generateParagraph({nodeToExpand: nodeToRegenerate}));
  }
);

export const regenerateActions = createAsyncThunk(
  'story/regenerateActions',
  async (nodeToRegenerate: number, { dispatch }) => {
    dispatch(deleteNode(nodeToRegenerate));
    await dispatch(generateActions({nodeToExpand: nodeToRegenerate}));
  }
);

export const saveName = createAsyncThunk(
  'story/saveName',
  async (_, { getState }) => {
    const state = getState() as { story: StoryState };
    await reqSaveName(state.story.id, state.story.name);
  }
);

export const saveGraph = createAsyncThunk(
  'story/saveGraph',
  async (_, { getState }) => {
    const state = getState() as { story: StoryState };
    await reqSaveGraph(state.story.id, state.story.graph);
  }
);

export const getGraph = createAsyncThunk(
  'story/getGraph',
  async (_, { getState }) => {
    const state = getState() as { story: StoryState };
    const response = await reqGetStory(state.story.id);
    const json = await response.json() as { story: GraphMessage, name: string };

    return { graph: json.story, name: json.name }; // TODO should refactor backend to use graph consistently
  }
);

export const initStory = createAsyncThunk(
  'account/initStory',
  async (_, { dispatch }) => {
    const response = await reqInitStory();
    const json = await response.json() as { storyId: string };

    dispatch(loadStories());

    dispatch(setId({ storyId: json.storyId }));

    dispatch(setGoToGenerator(true));

    return { storyId: json.storyId };
  }
);

const handleGetGraphResponse = (state: StoryState, action: PayloadAction<{ graph: GraphMessage, name: string }>) => {
  state.graph = graphMessageToGraphLookup(action.payload.graph);
  state.name = action.payload.name;
  state.loadingSection = null;
};

const handleInitStoryResponse = (state: StoryState, action: PayloadAction<{ storyId: string }>) => {
  state.id = action.payload.storyId;
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    reset: () => initialState,
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
    },
    deleteNode: (state, action: PayloadAction<number>) => {
      state.graph = deleteNodeFromGraph(state.graph, action.payload)
    },
    setNodeData: (state, action: PayloadAction<{ nodeId: number, data: string }>) => {
      state.graph.nodeLookup[action.payload.nodeId].data = action.payload.data;
    },
    setId: (state, action: PayloadAction<{ storyId: string }>) => {
      state.id = action.payload.storyId;
    },
    setGoToGenerator: (state, action: PayloadAction<boolean>) => {
      state.goToGenerator = action.payload;
    },

    // reducers for the ws middleware
    graphResponse: (state, action: PayloadAction<Graph>) => {
      state.loadingSection = null;
      state.graph = action.payload;
    },
    generateStartParagraph: (state, _action: PayloadAction<{ prompt: string }>) => {
      state.loadingSection = LoadingType.InitialStory;
    },
    generateParagraph: (state, _action: PayloadAction<{ nodeToExpand: number }>) => {
      state.loadingSection = LoadingType.GenerateParagraph;
    },
    generateActions: (state, _action: PayloadAction<{ nodeToExpand: number }>) => {
      state.loadingSection = LoadingType.GenerateActions;
    },
    generateEnding: (state, _action: PayloadAction<{ nodeToEnd: number }>) => {
      state.loadingSection = LoadingType.GenerateEnding;
    },
    connectNodes: (state, _action: PayloadAction<{ fromNode: number, toNode: number }>) => {
      state.loadingSection = LoadingType.ConnectingNodes;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGraph.fulfilled, handleGetGraphResponse);

    builder.addCase(initStory.fulfilled, handleInitStoryResponse);
  },
});

export const {
  reset,
  setGraph,
  setName,
  deleteNode,
  setNodeData,
  setId,
  setGoToGenerator,
  graphResponse,
  generateStartParagraph,
  generateParagraph,
  generateActions,
  generateEnding,
  connectNodes,
} = storySlice.actions;

export const selectGoToGenerator = (state: RootState) => state.story.goToGenerator;
export const selectStoryGraph = (state: RootState) => state.story.graph;
export const selectStoryId = (state: RootState) => state.story.id;
export const selectStoryName = (state: RootState) => state.story.name;
export const selectLoadingSection = (state: RootState) => state.story.loadingSection;

export default storySlice.reducer;
