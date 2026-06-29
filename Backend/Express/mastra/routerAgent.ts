import { Agent } from "@mastra/core/agent";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const groq = createOpenAICompatible({
    name: "groq",
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
});

export const model = groq("llama-3.3-70b-versatile");

export const routerAgent = new Agent({
    id: "router-agent",
    name: "Router Agent",
    model: model,

    instructions: `
    Decide which agent should handle the request.
    You must output ONLY the agent name, nothing else. No explanation, no punctuation, no surrounding text.

    Routes:
    - If the user wants to create, add, design, insert, or make a field or section: CreateAgent
    - If the user wants to update, modify, edit, change, rename, or reorder a field or section: UpdateAgent
    - If the user wants to delete, remove, clear, or destroy a field or section: DeleteAgent
    - If the user wants to view, list, show, read, search, get, or describe fields or sections: QueryAgent
  `
});