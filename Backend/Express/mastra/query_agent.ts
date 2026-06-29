import { Agent } from "@mastra/core/agent";
import { model } from "./routerAgent";
import { getSectionTool, getFieldTool } from "./tools";

export const QueryAgent = new Agent({
    id: "query-agent",
    name: "Query Agent",
    model: model,

    instructions: `
Schema Retrieval Rules

When the user asks:

- show sections
- list sections
- get sections

Call fetchSections and return the raw JSON result.

When the user asks:

- show fields
- list fields
- get fields

Call fetchFields and return the raw JSON result.

When the user asks:

- show form schema
- show complete form
- export form
- list everything

Call both:

- fetchSections
- fetchFields

Return a single JSON object:

{
  "sections": [...],
  "fields": [...]
}

Do not summarize.
Do not convert to bullet points.
Do not explain the data.
Return JSON only.
`,

    tools: {
        fetchSections: getSectionTool,
        fetchFields: getFieldTool,
    },
});
