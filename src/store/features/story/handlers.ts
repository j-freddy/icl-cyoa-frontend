import { PayloadAction } from "@reduxjs/toolkit";
import { graphMessageToGraphLookup } from "../../../utils/graph/graphUtils";
import { GraphMessage } from "../../../utils/graph/types";
import { StoryState } from "../storySlice";


export const handleGetGraphFulfilled = (
  state: StoryState,
  action: PayloadAction<{ graph: GraphMessage, name: string }>
) => {
  state.graph = graphMessageToGraphLookup(action.payload.graph);
  state.title = action.payload.name;
  state.loadingSection = null;
};


export const handleInitStoryFulfilled = (
  state: StoryState,
  action: PayloadAction<{ storyId: string }>
) => {
  state.id = action.payload.storyId;
};