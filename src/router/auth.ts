import { Hono } from 'hono'

import authController from '../controller/auth.controller'
import { use } from "../utils/commonUtils"
import validateRequest from "../utils/validation/validateRequest"

const authRouter = new Hono().basePath('/auth')

authRouter.get('/', (c) => c.json({ data: 'All list' }))
authRouter.post('/register', validateRequest('registerValidationSchema'), use(authController.register))
authRouter.post('/login', use(authController.login))

export default authRouter
