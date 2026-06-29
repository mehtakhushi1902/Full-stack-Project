import { db } from "../drizzle/index.js";
import { todos } from "../drizzle/src/db/schema.js";
export const createTodo = async (c) => {

    try {
        const user = c.get("user");
        console.log("userr", user);
        const { title, description } = await c.req.json();

        console.log(title, description)
        const data = await db.insert(todos).values({
            title,
            description,
            userId: user.id,
        }).returning();

        return c.json({ message: "Todo created", data: data });
    } catch (error) {
        console.log(error);
        return c.json({ message: "Internal server error" }, 500);
    }

}