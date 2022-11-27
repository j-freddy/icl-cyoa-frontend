import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import StatusCode from "status-code-enum";
import { reqGetStories, reqLogin, reqLoginWithSession } from "../api/restRequests";
import { RootState } from "../app/store";

type StoryListEntry = {
    name: string,
    storyId: string,
}

type AuthResponse = {
    email?: string,
    status: StatusCode,
}

interface AccountState {
    stories: StoryListEntry[],
    loggedIn: boolean,
    email?: string,
    sessionLoginFail: boolean,
    credentialsLoginFail: boolean,
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
        const status = await response.status;
        return { email: data.email, status };
    }
);

export const loginWithSession = createAsyncThunk(
    'account/loginWithSession',
    async () => {
        const response = await reqLoginWithSession();
        const json = await response.json() as { email: string };
        const status = await response.status;
        return { email: json.email, status };
    }
);

export const loadStories = createAsyncThunk(
    'account/loadStories',
    async () => {
        const response = await reqGetStories();
        const json = await response.json() as { stories: StoryListEntry[] };
        return json.stories;
    }
);

const handleSessionLoginResponse = (
    state: AccountState, action: PayloadAction<AuthResponse>
) => {
    const status = action.payload.status;
    if (status !== StatusCode.SuccessOK) {
        handleSessionLoginFailure(state);
        return;
    }

    state.loggedIn = true;
    state.email = action.payload.email;
    state.sessionLoginFail = false;
};

const handleSessionLoginFailure = (state: AccountState) => {
    state.sessionLoginFail = true;
};

const handleCredLoginResponse = (
    state: AccountState, action: PayloadAction<AuthResponse>
) => {
    const status = action.payload.status;
    if (status !== StatusCode.SuccessOK) {
        handleCredLoginFailure(state);
        return;
    }
    state.loggedIn = true;
    state.email = action.payload.email;
    state.credentialsLoginFail = false;
};

const handleCredLoginFailure = (state: AccountState) => {
    state.credentialsLoginFail = true;
};

const handleLoadStoriesResponse = (state: AccountState, action: PayloadAction<StoryListEntry[]>) => {
    state.stories = action.payload;
};

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
    }
});

export const selectLoggedIn = (state: RootState) => state.account.loggedIn;
export const selectCredentialLoginFail = (state: RootState) => state.account.credentialsLoginFail;
export const selectSessionLoginFail = (state: RootState) => state.account.sessionLoginFail;
export const selectStories = (state: RootState) => state.account.stories;

export default accountSlice.reducer;
