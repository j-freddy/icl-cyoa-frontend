import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteNodeFromGraph, isGraphEmpty } from '../../utils/graph/graphUtils';
import { Graph, LoadingType } from '../../utils/graph/types';
import { RootState } from '../store';
import { handleGetGraphFulfilled, handleInitStoryFulfilled } from './story/thunkHandlers';
import { displayLoadedNotification, displayLoadingNotification } from './story/LoadingNotifications';
import { getGraphThunk, initStoryThunk, regenerateActionsThunk, regenerateEndingThunk, regenerateManyThunk, regenerateParagraphThunk, saveGraphThunk, saveNameThunk } from './story/thunks';


export interface StoryState {
  id: string;
  title: string;
  graph: Graph;
  graphWasLoaded: boolean;

  temperature: number;
  descriptor: string;
  details: string;
  style: string;

  loadingSection: LoadingType | null;

  goToGenerator: boolean;
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

const initialState: StoryState = {
  id: "",
  title: "",
  graph: { nodeLookup: {} },
  graphWasLoaded: false,

  temperature: 0.6,
  descriptor: "",
  details: "",
  style: "",

  loadingSection: null,

  goToGenerator: false,
};


export const regenerateParagraph = regenerateParagraphThunk;
export const regenerateActions = regenerateActionsThunk;
export const regenerateEnding = regenerateEndingThunk;
export const regenerateMany = regenerateManyThunk;
export const saveName = saveNameThunk;
export const saveGraph = saveGraphThunk;
export const getGraph = getGraphThunk;
export const initStory = initStoryThunk;


export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    reset: () => initialState,
    setName: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
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
    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload;
    },
    setDescriptor: (state, action: PayloadAction<string>) => {
      state.descriptor = action.payload;
    },
    setDetails: (state, action: PayloadAction<string>) => {
      state.details = action.payload;
    },
    setStyle: (state, action: PayloadAction<string>) => {
      state.style = action.payload;
    },

    /* 
      Reducers for the WS middleware.
    */
    graphResponse: (state, action: PayloadAction<Graph>) => {
      if (state.loadingSection !== null) {
        displayLoadedNotification(state.loadingSection);
      }
      state.loadingSection = null;
      state.graph = action.payload;
    },
    generateInitialStoryBasic: (state, _action: PayloadAction<{ prompt: string }>) => {
      state.loadingSection = LoadingType.InitialStory;
      displayLoadingNotification(LoadingType.InitialStory);
    },
    generateInitialStoryAdvanced: (state, _action: PayloadAction<{
      values: { attribute: string, content: string }[]
    }>) => {
      state.loadingSection = LoadingType.InitialStory;
    },
    generateParagraph: (state, _action: PayloadAction<{ nodeToExpand: number }>) => {
      state.loadingSection = LoadingType.GenerateParagraph;
      displayLoadingNotification(LoadingType.GenerateParagraph);
    },
    generateActions: (state, _action: PayloadAction<{ nodeToExpand: number }>) => {
      state.loadingSection = LoadingType.GenerateActions;
      displayLoadingNotification(LoadingType.GenerateActions);
    },
    generateEnding: (state, _action: PayloadAction<{ nodeToEnd: number }>) => {
      state.loadingSection = LoadingType.GenerateEnding;
      displayLoadingNotification(LoadingType.GenerateEnding);
    },
    connectNodes: (state, _action: PayloadAction<{ fromNode: number, toNode: number }>) => {
      state.loadingSection = LoadingType.ConnectingNodes;
      displayLoadingNotification(LoadingType.ConnectingNodes);
    },
    generateMany: (state, _action: PayloadAction<{ fromNode: number, maxDepth: number }>) => {
      state.loadingSection = LoadingType.GenerateMany;
      displayLoadingNotification(LoadingType.GenerateMany);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGraph.fulfilled, handleGetGraphFulfilled);

    builder.addCase(initStory.fulfilled, handleInitStoryFulfilled);
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
  setTemperature,
  setDescriptor,
  setDetails,
  setStyle,
  graphResponse,
  generateInitialStoryBasic,
  generateInitialStoryAdvanced,
  generateParagraph,
  generateActions,
  generateEnding,
  connectNodes,
  generateMany,
} = storySlice.actions;


export const selectGoToGenerator = (state: RootState) => state.story.goToGenerator;
export const selectStoryGraph = (state: RootState) => state.story.graph;
export const selectStoryGraphWasLoaded = (state: RootState) => state.story.graphWasLoaded;
export const selectStoryIsEmpty = (state: RootState) => isGraphEmpty(state.story.graph);
export const selectStoryId = (state: RootState) => state.story.id;
export const selectStoryTitle = (state: RootState) => state.story.title;
export const selectLoadingSection = (state: RootState) => state.story.loadingSection;


export default storySlice.reducer;
