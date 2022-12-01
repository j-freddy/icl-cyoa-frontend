import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import StatusCode from "status-code-enum";
import { reqGetApiKey, reqGetStories, reqLogin, reqLoginWithSession, reqUpdateApiKey } from "../api/restRequests";
import { RootState } from "../app/store";

type StoryListEntry = {
  name: string,
  storyId: string,
  firstParagraph: string,
  totalSections: number,
}

type AuthResponse = {
  email?: string,
  status: StatusCode,
}

interface AccountState {
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

export const login = createAsyncThunk(
  'account/login',
  async (data: { email: string, password: string }) => {
    const response = await reqLogin(data.email, data.password);
    const json = await response.json() as {
      apiKey: string,
    };
    const status = response.status;

    return {
      email: data.email,
      apiKey: json.apiKey,
      status
    };
  }
);

export const loginWithSession = createAsyncThunk(
  'account/loginWithSession',
  async () => {
    const response = await reqLoginWithSession();
    const json = await response.json() as {
      email: string,
      apiKey: string,
    };
    const status = response.status;

    return {
      email: json.email,
      status
    };
  }
);

export const loadStories = createAsyncThunk(
  'account/loadStories',
  async () => {
    const response = await reqGetStories();
    const json = await response.json() as {
      stories: StoryListEntry[]
    };

    return json.stories;
  }
);

export const getApiKey = createAsyncThunk(
  'account/getKey',
  async () => {
    const response = await reqGetApiKey();
    const json = await response.json() as {
      apiKey: string
    };

    return json.apiKey;
  }
);

export const updateApiKey = createAsyncThunk(
  'account/updateKey',
  async (apiKey: string) => {
    const response = await reqUpdateApiKey(apiKey);
    const json = await response.json() as {
      apiKey: string
    };

    return json.apiKey;
  }
);


const handleSessionLoginResponse = (
  state: AccountState, 
  action: PayloadAction<AuthResponse>,
) => {
  const status = action.payload.status;
  if (status !== StatusCode.SuccessOK) {
    handleSessionLoginFailure(state);
    return;
  }

  state.loggedIn = true;
  state.sessionLoginFail = false;

  state.email = action.payload.email;
};
const handleSessionLoginFailure = (state: AccountState) => {
  state.sessionLoginFail = true;
};


const handleCredLoginResponse = (
  state: AccountState, 
  action: PayloadAction<AuthResponse>,
) => {
  const status = action.payload.status;
  if (status !== StatusCode.SuccessOK) {
    handleCredLoginFailure(state);
    return;
  }

  state.loggedIn = true;
  state.credentialsLoginFail = false;

  state.email = action.payload.email;
};
const handleCredLoginFailure = (state: AccountState) => {
  state.credentialsLoginFail = true;
};


const handleLoadStoriesResponse = (state: AccountState, action: PayloadAction<StoryListEntry[]>) => {
  state.stories = action.payload;
};


const handleGetApiKeyResponse = (state: AccountState, action: PayloadAction<string>) => {
  state.apiKey = action.payload;
}

const handleUpdateApiKeyResponse = (state: AccountState, action: PayloadAction<string>) => {
  state.apiKey = action.payload;
}


export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, handleCredLoginResponse);
    builder.addCase(login.rejected, handleCredLoginFailure);

    builder.addCase(loginWithSession.fulfilled, handleSessionLoginResponse);
    builder.addCase(loginWithSession.rejected, handleSessionLoginFailure)

    builder.addCase(loadStories.fulfilled, handleLoadStoriesResponse);

    builder.addCase(getApiKey.fulfilled, handleGetApiKeyResponse);

    builder.addCase(updateApiKey.fulfilled, handleUpdateApiKeyResponse);
  }
});

export const selectLoggedIn = (state: RootState) => state.account.loggedIn;
export const selectEmail = (state: RootState) => state.account.email;
export const selectApiKey = (state: RootState) => state.account.apiKey;
export const selectCredentialLoginFail = (state: RootState) => state.account.credentialsLoginFail;
export const selectSessionLoginFail = (state: RootState) => state.account.sessionLoginFail;
export const selectStories = (state: RootState) => state.account.stories;

export default accountSlice.reducer;
