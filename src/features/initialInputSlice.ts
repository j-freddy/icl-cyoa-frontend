import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useAppDispatch } from "../app/hooks";
import { Graph } from "../utils/graph/types";
import storySlice, { generateStoryWithAdvancedInput, setGraph } from "./storySlice";

interface InitialInputState {
    values: {attribute: string, content: string}[]
}

const defaultValues: {attribute: string, content: string}[] = [
    {attribute: "themes", content: ""},
    {attribute: "characters", content: ""},
    {attribute: "items", content: ""}
];

const initialState: InitialInputState = {
    values: defaultValues
};

export const generateInitialStory = createAsyncThunk(
    "initialInput/generateInitialStory",
    async (_, { getState, dispatch } ) => {
        const state = getState() as {initialInput: InitialInputState};
        dispatch(generateStoryWithAdvancedInput({values: state.initialInput.values}));
    }
);

export const initialInputSlice = createSlice({
    name: "initialInput",
    initialState,
    reducers: {
        setAttribute: (state, action: PayloadAction<{position: number, data: string}>) => {
            state.values[action.payload.position] = {
                attribute: action.payload.data, 
                content: state.values[action.payload.position].content
            }
        },
        setContent: (state, action: PayloadAction<{position: number, data: string}>) => {
            state.values[action.payload.position] = {
                attribute: state.values[action.payload.position].attribute, 
                content: action.payload.data
            }
        },
        removeEntry: (state, action: PayloadAction<{position: number}>) => {
            state.values.splice(action.payload.position, 1)
        },
        addEntry: (state) => {
            state.values.push({attribute: "", content: ""})
        },
    }
});

export const {
    setAttribute,
    setContent,
    removeEntry,
    addEntry
} = initialInputSlice.actions;

export default initialInputSlice.reducer;