import { Hono } from 'hono'
import { authMiddleare } from '../middleware/betterAuthMiddleware.ts';
import { createTodo } from '../Controller/todos.js';

const router = new Hono();

router.use(authMiddleare);
router.post("/create", createTodo);

export default router;