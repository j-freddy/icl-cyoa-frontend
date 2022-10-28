import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nodeDataToGraph } from '../graph/graphUtils';
import { Graph, NodeData } from '../graph/types';

interface StoryState {
  graph: Graph;
};

const initialState: StoryState = {
  graph: nodeDataToGraph([]),
};

export const exampleText = "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.";

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<Graph>) => {
      state.graph = action.payload;
    },
    setNodeData: (state, action: PayloadAction<NodeData[]>) => {
      state.graph = nodeDataToGraph(action.payload);
    },
    setAction: (state, action: PayloadAction<{nodeId: number, action: string}>) => {
      state.graph.nodeLookup[action.payload.nodeId].action = action.payload.action;
    },
    setParagraph: (state, action: PayloadAction<{nodeId: number, paragraph: string}>) => {
      state.graph.nodeLookup[action.payload.nodeId].paragraph = action.payload.paragraph;
    },
  },
});

export const { setNodeData, setGraph, setAction, setParagraph } = storySlice.actions;

export default storySlice.reducer;
