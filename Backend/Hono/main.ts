import { Hono } from 'hono'
import fieldRouter from './Routes/fields.js';
import todos from "./Routes/todos.js";

import sectionRouter from "./Routes/section.js"
import { cors } from "hono/cors";
import { auth } from './lib/auth.ts';


const app = new Hono()
app.use(cors({
    origin: "*",
    credentials: true
}));
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route('/hono/fields', fieldRouter)
app.route('/hono/sections', sectionRouter)
app.route('/hono/todo', todos)

app.get('/', (c) => c.text('Hello Deno!'))


Deno.serve(app.fetch)