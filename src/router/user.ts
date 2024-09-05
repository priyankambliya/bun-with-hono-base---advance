import { Hono } from 'hono'

import userController from '../controller/user.controller'
import { use, useMiddleware } from "../utils/commonUtils"
import { jwtAuth } from "../middleware/auth.middleware"

const userRouter = new Hono().basePath('/user')

userRouter.get('/', (c) => c.json({ data: 'All Users list' }))
userRouter.get('/profile', useMiddleware(jwtAuth(['admin', 'user'])), use(userController.getProfile))

export default userRouter
