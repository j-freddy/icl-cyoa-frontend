import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nodeDataToGraph } from '../graph/graphUtils';
import { Graph, NodeData } from '../graph/types';

interface StoryState {
  graph: Graph;
}

const initialState: StoryState = {
  graph: nodeDataToGraph([]),
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setNodeData: (state, action: PayloadAction<NodeData[]>) => {
      state.graph = nodeDataToGraph(action.payload);
    },
  },
});

export const { setNodeData } = storySlice.actions;

export default storySlice.reducer;

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";
