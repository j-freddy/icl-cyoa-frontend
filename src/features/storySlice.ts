import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { graphMessageToGraphLookup } from '../graph/graphUtils';
import { Graph, GraphMessage, SectionType } from '../graph/types';

interface StoryState {
  graph: Graph;
  // Queues are non-serialisable
  // This is OK as it is impractical for the user to
  // click 'Generate' thousands of times
  loadingSections: SectionType[];
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

const initialState: StoryState = {
  graph: { nodeLookup: {} },
  loadingSections: [],
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
    },

    addLoadingSection: (state, action: PayloadAction<SectionType>) => {
      state.loadingSections.push(action.payload);
    },

    setNodeDataFromGPT: (
      state,
      action: PayloadAction<GraphMessage>,
    ) => {
      state.graph = graphMessageToGraphLookup(action.payload);
      // Section has loaded
      if (state.loadingSections.length > 0) {
        state.loadingSections.shift();
      }
    },

    setData: (
      state,
      action: PayloadAction<{nodeId: number, data: string}>
    ) => {
      state.graph.nodeLookup[action.payload.nodeId].data
        = action.payload.data;
    },
  },
});

export const {
  addLoadingSection,
  setNodeDataFromGPT,
  setGraph,
  setData,
} = storySlice.actions;

export default storySlice.reducer;
