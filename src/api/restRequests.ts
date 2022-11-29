import { graphToGraphMessage } from "../utils/graph/graphUtils";
import { Graph } from "../utils/graph/types";

// const API_URL: string = "https://cyoa-api-int-stable.herokuapp.com/";
const API_URL: string = "https://cyoa-api-prod.herokuapp.com/"
// LOCALHOST
// const API_URL: string = "http://localhost:8000/"
const LOGIN_URL: string = API_URL + "login";
const SIGNUP_URL: string = API_URL + "signup";
const STORIES_URL: string = API_URL + "stories";

export const reqLogin = async (email: string, password: string) => {
	return fetch(LOGIN_URL, {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: {
			"Content-Type": "application/json",
		},
		// 8 hours of debugging for user session cookies
		credentials: "include",
	});
};

export const reqInitStory = async () => {
	return fetch(STORIES_URL, {
		method: "POST",
		body: JSON.stringify({ type: "init" }),
		credentials: "include",
	});
};

export const reqGetStories = async () => {
	return fetch(STORIES_URL, {
		method: "POST",
		body: JSON.stringify({ type: "getStories" }),
		credentials: "include",
	});
};

export const reqSaveName = async (storyId: string, name: string) => {
	return fetch(STORIES_URL, {
		method: "POST",
		body: JSON.stringify({ type: "saveName", storyId, name }),
		credentials: "include",
	});
};

export const reqSaveGraph = async (storyId: string, graph: Graph) => {
	return fetch(STORIES_URL, {
		method: "POST",
		body: JSON.stringify({
			type: "saveStory",
			storyId,
			story: graphToGraphMessage(graph),
		}),
		credentials: "include",
	});
};

export const reqGetStory = async (storyId: string) => {
	return fetch(STORIES_URL, {
		method: "POST",
		body: JSON.stringify({ type: "getStoryFromId", storyId }),
		credentials: "include",
	});
};

export const reqLoginWithSession = async () => {
	return fetch(LOGIN_URL, {
		method: "GET",
		credentials: "include",
	});
};

export const reqSignup = async (email: string, password: string) => {
	return fetch(SIGNUP_URL, {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: {
			"Content-Type": "application/json",
		},
		// Required to set session cookie on signup
		credentials: "include",
	});
};
