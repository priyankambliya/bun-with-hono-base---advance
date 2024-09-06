import { config } from 'dotenv'
import { Context, Hono, Next } from 'hono'
import { StatusCode } from "hono/utils/http-status"
import './database'
import routes from "./router"
import appArrays from "./utils/common/appArrays"
import { appStatusCodes } from "./utils/common/appStatusCodes"
import errorHandler, { errorInstanceHandling, throwError } from "./utils/errorHandler"
import { superAuth } from "./utils/cred"
config()

const app = new Hono({ strict: true })

process.on('uncaughtException', errorHandler.uncaughtExceptionHandler)
process.on('unhandledRejection', errorHandler.unhandledRejectionHandler)

app.use(async (c: Context, next: Next) => {
    if (!appArrays.nodeConfig.includes(process.env.NODE_ENV as string)) throwError("please add proper cred", appStatusCodes.BAD_GATEWAY as StatusCode)
    await next()
})

app.route('/api', routes)

app.use(errorHandler.errorHandler())
app.onError(errorInstanceHandling)

superAuth()

export default app