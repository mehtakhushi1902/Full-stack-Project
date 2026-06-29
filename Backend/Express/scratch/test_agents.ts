import dotenv from "dotenv";
dotenv.config();
import { routerAgent } from "../mastra/routerAgent.ts";
import { CreateAgent } from "../mastra/create_agent.ts";
import { UpdateAgent } from "../mastra/update_agent.ts";
import { DeleteAgent } from "../mastra/delete_agent.ts";
import { QueryAgent } from "../mastra/query_agent.ts";

async function runTest(prompt: string) {
    console.log(`\n========================================`);
    console.log(`Prompt: "${prompt}"`);
    try {
        const routeResponse = await routerAgent.generate(prompt);
        const decision = routeResponse.text.trim();
        console.log(`Router decision: "${decision}"`);

        let targetAgent = CreateAgent;
        if (decision.includes("UpdateAgent")) {
            targetAgent = UpdateAgent;
        } else if (decision.includes("DeleteAgent")) {
            targetAgent = DeleteAgent;
        } else if (decision.includes("QueryAgent")) {
            targetAgent = QueryAgent;
        } else if (decision.includes("CreateAgent")) {
            targetAgent = CreateAgent;
        } else {
            console.log("No specific agent matched in decision, using keyword check...");
            const lowerPrompt = prompt.toLowerCase();
            if (lowerPrompt.includes("update") || lowerPrompt.includes("change") || lowerPrompt.includes("rename") || lowerPrompt.includes("modify")) {
                targetAgent = UpdateAgent;
            } else if (lowerPrompt.includes("delete") || lowerPrompt.includes("remove") || lowerPrompt.includes("destroy")) {
                targetAgent = DeleteAgent;
            } else if (lowerPrompt.includes("show") || lowerPrompt.includes("list") || lowerPrompt.includes("view") || lowerPrompt.includes("get") || lowerPrompt.includes("query")) {
                targetAgent = QueryAgent;
            }
        }
        console.log(`Routed to: ${targetAgent.name}`);
    } catch (error) {
        console.error("Test failed with error:", error);
    }
}

async function main() {
    await runTest("Create a text field called City in Personal Information section");
    await runTest("Rename section Personal Information to Personal Details");
    await runTest("Remove the field City from Personal Details");
    await runTest("Show me all the sections and fields on this form");
}

main().catch(console.error);
