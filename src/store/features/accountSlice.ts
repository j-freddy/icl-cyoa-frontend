import {
  getApiKey,
  loadStories,
  login,
  loginWithSession,
  updateApiKey
} from "./account/thunks";
import {
  handleLoginFulfilled,
  handleLoginRejected,
  handleLoginWithSessionRejected,
  handleLoginWithSessionFulfilled,
  handleLoadStoriesFulfilled,
  handleGetApiKeyFulfilled,
  handleUpdateApiKeyFulfilled
} from "./account/handlers";
import { createSlice } from "@reduxjs/toolkit"
import StatusCode from "status-code-enum";
import { RootState } from "../store";


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

  email?: string,
  apiKey?: string,

  stories: StoryListEntry[],
}

const initialState: AccountState = {
  stories: [],
  loggedIn: false,
  sessionLoginFail: false,
  credentialsLoginFail: false
};


export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, handleLoginFulfilled);
    builder.addCase(login.rejected, handleLoginRejected);

    builder.addCase(loginWithSession.fulfilled, handleLoginWithSessionFulfilled);
    builder.addCase(loginWithSession.rejected, handleLoginWithSessionRejected)

    builder.addCase(loadStories.fulfilled, handleLoadStoriesFulfilled);

    builder.addCase(getApiKey.fulfilled, handleGetApiKeyFulfilled);

    builder.addCase(updateApiKey.fulfilled, handleUpdateApiKeyFulfilled);
  }
});

export {
  getApiKey,
  loadStories,
  login,
  loginWithSession,
  updateApiKey
}

export const selectLoggedIn = (state: RootState) => state.account.loggedIn;
export const selectEmail = (state: RootState) => state.account.email;
export const selectApiKey = (state: RootState) => state.account.apiKey;
export const selectCredentialLoginFail = (state: RootState) => state.account.credentialsLoginFail;
export const selectSessionLoginFail = (state: RootState) => state.account.sessionLoginFail;
export const selectStories = (state: RootState) => state.account.stories;

export default accountSlice.reducer;
