import { Context, Next } from "hono"
import Validators from './index'
import { RegisterRequestBody } from "../interface/auth.interface";

type ValidatorKeys = keyof typeof Validators;

export default function validateRequest(validator: ValidatorKeys) {
    return async (c: Context, next: Next) => {
        const validatorSchema = Validators[validator];
        if (!validatorSchema) {
            throw new Error(`'${validator}' validator does not exist`);
        }

        const isValid = validatorSchema.parse(await c.req.json<RegisterRequestBody>());
        if (!isValid) {
            console.log("i want to handle error")
            return c.json({ error: 'Invalid request data' }, 400);
        }

        await next();
    };
}

