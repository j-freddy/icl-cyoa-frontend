import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface InputFormState {
  value: string;
}

const initialState: InputFormState = {
  value: ""
}

export const inputFormSlice = createSlice({
  name: 'inputForm',
  initialState,
  reducers: {
    editText: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    generateText: (state) => {
      // TODO: connect this to backend for text generation
      state.value = state.value.concat("Generated Text ");
    }
  },
})

// Action creators are generated for each case reducer function
export const { editText, generateText } = inputFormSlice.actions;

export const selectText = (state: RootState) => state.text.value;

export default inputFormSlice.reducer;

// Example text passed into GeneratorViewProps
export const exampleText = `You are a commoner living in the large kingdom of
Garion. Your kingdom has been in bitter war with the neighboring kingdom,
Liore, for the past year. You dream of doing something great and going on an
adventure. You walk around town and see warning posters about the dangers of
the dark forest at the edge of town. You go to the market and see military
representatives signing people up for the army.`;
