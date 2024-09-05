import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { appStatusCodes } from "./common/appStatusCodes";

const uncaughtExceptionHandler = (error: any, origin: any) => {
    console.log("----- Uncaught exception -----");
    console.log(error);
    console.log("----- Exception origin -----");
    console.log(origin);
    process.exit(1)
}

const unhandledRejectionHandler = (reason: any, promise: any) => {
    console.log("----- Unhandled Rejection at -----");
    console.log(promise);
    console.log("----- Reason -----");
    console.log(reason);
    process.exit(1)
}

const errorHandler = () => {
    return async (c: Context, next: Next) => {
        try {
            await next();
        } catch (error: any) {
            console.log("+ ============================== ERROR OCCURS ================================ +");
            const status = error.statusCode || 500;
            const message = error.message || 'Internal Server Error';
            return c.json({ error: message }, status);
        }
    };
};

export const throwError = (message: string, code: StatusCode = 500) => {
    const error = new HTTPException(code, { message })
    throw error
}

export const errorInstanceHandling = (err: any, c: Context) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
    }
    if (err instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((err) => {
            const field = err.path.join('.');
            formattedErrors[field] = err.message;
        });

        return c.json({ error: 'Invalid request data', details: formattedErrors }, appStatusCodes.BAD_REQUEST as StatusCode);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
}

export default { uncaughtExceptionHandler, unhandledRejectionHandler, errorHandler };