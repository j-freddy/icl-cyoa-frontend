import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nodeDataToGraph } from '../../graph/graphUtils';
import { Graph, NodeData } from '../../graph/types';

interface StoryState {
  graph: Graph;
}

// For testing.
const nodeData: NodeData[] = [
  {
    nodeId: 0,
    action: null,
    paragraph: "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.",
    parentId: null,
    childrenIds: [],
  }
];

// const nodeData: NodeData[] = [
//   {
//     nodeId: 0,
//     action: null,
//     paragraph: "You are a commoner living in the large kingdom of Garion. Your kingdom has been in bitter war with the neighboring kingdom, Liore, for the past year. You dream of doing something great and going on an adventure. You walk around town and see warning posters about the dangers of the dark forest at the edge of town. You go to the market and see military representatives signing people up for the army.",
//     parentId: null,
//     childrenIds: [],
//   },
// ];

const initialState: StoryState = {
  graph: nodeDataToGraph(nodeData),
}

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setNodeData: (state, action: PayloadAction<NodeData[]>) => {
      state.graph = nodeDataToGraph(action.payload);
      console.log(state.graph)
    },
  },
});

export const { setNodeData } = storySlice.actions;

export default storySlice.reducer;
