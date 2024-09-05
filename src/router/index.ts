import { Hono } from 'hono'

import userRouter from "./user"
import authRouter from "./auth"
import publicRouter from "./public"

const router = new Hono()

router.get('/ping', (c) => c.json({ message: 'pong' }))
router.route('/', publicRouter)
router.route('/', userRouter)
router.route('/', authRouter)

export default router
