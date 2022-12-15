import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  reqGetApiKey,
  reqGetStories,
  reqLogin,
  reqLoginWithSession,
  reqUpdateApiKey
} from "../../../api/rest/accountRequests";
import { StoryListEntry } from "../accountSlice";


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
  async (apiKey: string | undefined) => {
    const response = await reqUpdateApiKey(apiKey);
    const json = await response.json() as {
      apiKey: string
    };

    return json.apiKey;
  }
);