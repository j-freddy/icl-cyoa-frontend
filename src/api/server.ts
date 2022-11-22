import { graphToGraphMessage } from "../utils/graph/graphUtils";
import { Graph } from "../utils/graph/types";

// const API_URL: string = "https://cyoa-api-int-stable.herokuapp.com/";
// LOCALHOST
const API_URL: string = "http://localhost:8000/"
const LOGIN_URL: string = API_URL + "login";
const SIGNUP_URL: string = API_URL + "signup";
const STORIES_URL: string = API_URL + "stories";

export class API {
	static login = async (email: string, password: string) => {
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

	static initStory = async () => {
		return fetch(STORIES_URL, {
			method: "POST",
			body: JSON.stringify({ type: "init" }),
			credentials: "include",
		});
	};

	static getStories = async () => {
		return fetch(STORIES_URL, {
			method: "POST",
			body: JSON.stringify({ type: "getStories" }),
			credentials: "include",
		});
	};

	static saveName = async (storyId: string, name: string) => {
		return fetch(STORIES_URL, {
			method: "POST",
			body: JSON.stringify({ type: "saveName", storyId, name }),
			credentials: "include",
		});
	};

	static saveGraph = async (storyId: string, graph: Graph) => {
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

	static getStory = async (storyId: string) => {
		return fetch(STORIES_URL, {
			method: "POST",
			body: JSON.stringify({ type: "getStoryFromId", storyId }),
			credentials: "include",
		});
	};

	static loginWithSession = async () => {
		return fetch(LOGIN_URL, {
			method: "GET",
			credentials: "include",
		});
	};

	static signup = async (email: string, password: string) => {
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

	static generateParagraph = async (graph: Graph, nodeToExpand: number) => {
		return fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({
				type: "generateNarrative",
				data: {
					nodeToExpand,
					graph: graphToGraphMessage(graph),
				},
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static generateStartParagraph = async (prompt: string) => {
		return fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({
				type: "startNode",
				data: {
					prompt: prompt,
				},
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static generateActions = async (graph: Graph, nodeToExpand: number) => {
		return fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({
				type: "generateActions",
				data: {
					nodeToExpand,
					graph: graphToGraphMessage(graph),
				},
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static endPath = async (graph: Graph, nodeToEnd: number) => {
		return fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({
				type: "endNode",
				data: {
					nodeToEnd,
					graph: graphToGraphMessage(graph),
				},
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static connectNodes = async (
		graph: Graph,
		fromNode: number,
		toNode: number
	) => {
		return fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({
				type: "connectNode",
				data: {
					fromNode,
					toNode,
					graph: graphToGraphMessage(graph),
				},
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}
