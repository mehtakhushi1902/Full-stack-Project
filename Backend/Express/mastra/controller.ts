import { routerAgent } from "./routerAgent.ts";
import { CreateAgent } from "./create_agent.ts";
import { UpdateAgent } from "./update_agent.ts";
import { DeleteAgent } from "./delete_agent.ts";
import { QueryAgent } from "./query_agent.ts";
import { type Request, type Response } from "express";

const chatController = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    try {
        // 1. Ask routerAgent to decide which agent should handle the request
        const routeResponse = await routerAgent.generate(prompt);
        const decision = routeResponse.text.trim();
        console.log("Router decision:", decision);

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
            const lowerPrompt = prompt.toLowerCase();
            if (
                lowerPrompt.includes("update") ||
                lowerPrompt.includes("change") ||
                lowerPrompt.includes("rename") ||
                lowerPrompt.includes("modify") ||
                lowerPrompt.includes("edit")
            ) {
                targetAgent = UpdateAgent;
            } else if (
                lowerPrompt.includes("delete") ||
                lowerPrompt.includes("remove") ||
                lowerPrompt.includes("destroy") ||
                lowerPrompt.includes("clear")
            ) {
                targetAgent = DeleteAgent;
            } else if (
                lowerPrompt.includes("show") ||
                lowerPrompt.includes("list") ||
                lowerPrompt.includes("view") ||
                lowerPrompt.includes("get") ||
                lowerPrompt.includes("query") ||
                lowerPrompt.includes("display")
            ) {
                targetAgent = QueryAgent;
            }
        }

        console.log("Routing request to:", targetAgent.name);

        // 2. Generate response using the target agent
        const response = await targetAgent.generate(prompt);

        if (response.type === "tool-call") {
            return res.json({
                success: false,
                message: "Tool call is not supported",
            });
        }

        if (response.type === "error") {
            return res.json({
                success: false,
                message: response.error.message,
            });
        }
        console.log("message in query", JSON.stringify(response.text))

        return res.json({
            message: response.text,
            toolCalls: response.toolCalls,
            toolResults: response.toolResults,
            usage: response.usage,
        });

    } catch (err: any) {
        console.error("Error in chatController:", err);
        return res.json({
            success: false,
            message: err.message || "An error occurred",
        });
    }
}

export default chatController;
