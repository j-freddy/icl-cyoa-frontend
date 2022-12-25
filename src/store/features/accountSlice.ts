import { createSlice } from "@reduxjs/toolkit";
import StatusCode from "status-code-enum";
import { RootState } from "../store";
import {
  handleGetApiKeyFulfilled, handleLoadStoriesFulfilled, handleLoginFulfilled,
  handleLoginRejected, handleLoginWithSessionFulfilled, handleLoginWithSessionRejected, 
  handleSignupFulfilled, handleSignupRejected, handleUpdateApiKeyFulfilled, handleDeleteStoryFulfilled
} from "./account/handlers";
import {
  getApiKeyThunk,
  loadStoriesThunk,
  loginThunk,
  signupThunk,
  loginWithSessionThunk,
  updateApiKeyThunk,
  deleteStoryThunk,
} from "./account/thunks";


export type StoryListEntry = {
  name: string,
  storyId: string,
  firstParagraph: string,
  totalSections: number,
}

export type AuthResponse = {
  email?: string,
  status: StatusCode,
}

export interface AccountState {
  loggedIn: boolean,
  sessionLoginFail: boolean,
  credentialsLoginFail: boolean,
  signupError: boolean,

  email?: string,
  apiKey?: string,

  stories: StoryListEntry[],
}

const initialState: AccountState = {
  stories: [],
  loggedIn: false,
  sessionLoginFail: false,
  credentialsLoginFail: false,
  signupError: false,
};


export const login = loginThunk;
export const loginWithSession = loginWithSessionThunk;
export const signup = signupThunk;
export const loadStories = loadStoriesThunk;
export const getApiKey = getApiKeyThunk;
export const updateApiKey = updateApiKeyThunk;
export const deleteStory = deleteStoryThunk;


export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, handleLoginFulfilled);
    builder.addCase(login.rejected, handleLoginRejected);

    builder.addCase(loginWithSession.fulfilled, handleLoginWithSessionFulfilled);
    builder.addCase(loginWithSession.rejected, handleLoginWithSessionRejected);

    builder.addCase(signup.fulfilled, handleSignupFulfilled);
    builder.addCase(signup.rejected, handleSignupRejected);

    builder.addCase(loadStories.fulfilled, handleLoadStoriesFulfilled);

    builder.addCase(getApiKey.fulfilled, handleGetApiKeyFulfilled);

    builder.addCase(updateApiKey.fulfilled, handleUpdateApiKeyFulfilled);

    builder.addCase(deleteStory.fulfilled, handleDeleteStoryFulfilled);
  }
});



export const selectLoggedIn = (state: RootState) => state.account.loggedIn;
export const selectEmail = (state: RootState) => state.account.email;
export const selectApiKey = (state: RootState) => state.account.apiKey;
export const selectCredentialLoginFail = (state: RootState) => state.account.credentialsLoginFail;
export const selectSessionLoginFail = (state: RootState) => state.account.sessionLoginFail;
export const selectSignupError = (state: RootState) => state.account.signupError;
export const selectStories = (state: RootState) => state.account.stories;

export default accountSlice.reducer;
