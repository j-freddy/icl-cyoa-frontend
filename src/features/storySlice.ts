import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nodeDataToGraph } from '../graph/graphUtils';
import { Graph, NodeData, SectionType } from '../graph/types';

interface StoryState {
  graph: Graph;
  // Queues are non-serialisable
  // This is OK as it is impractical for the user to
  // click 'Generate' thousands of times
  loadingSections: SectionType[];
};

const initialState: StoryState = {
  graph: nodeDataToGraph([]),
  loadingSections: [],
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
    },

    addLoadingSection: (state, action: PayloadAction<SectionType>) => {
      state.loadingSections.push(action.payload);
      console.log(state.loadingSections.length);
    },

    setNodeDataFromGPT: (
      state,
      action: PayloadAction<NodeData[]>,
    ) => {
      state.graph = nodeDataToGraph(action.payload);
      // Section has loaded
      if (state.loadingSections.length > 0) {
        state.loadingSections.shift();
      }
    },

    setAction: (
      state,
      action: PayloadAction<{nodeId: number, action: string}>
    ) => {
      state.graph.nodeLookup[action.payload.nodeId].action
        = action.payload.action;
    },

    setParagraph: (
      state,
      action: PayloadAction<{nodeId: number, paragraph: string}>
    ) => {
      state.graph.nodeLookup[action.payload.nodeId].paragraph
        = action.payload.paragraph;
    },
  },
});

export const {
  addLoadingSection,
  setNodeDataFromGPT,
  setGraph,
  setAction,
  setParagraph
} = storySlice.actions;

export default storySlice.reducer;
