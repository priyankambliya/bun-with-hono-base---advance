import { Context, Hono } from 'hono';
import { use } from "../utils/commonUtils";

const publicRouter = new Hono().basePath('/public')

publicRouter.get('/', use(async (c: Context) => {
    return c.json({ data: 'All list' })
}))

export default publicRouter