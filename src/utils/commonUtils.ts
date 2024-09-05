import { Context, Next } from 'hono';

export const useMiddleware = (fn: (c: Context, next: Next) => Promise<void>) => {
    return async (c: Context, next: Next) => {
        try {
            await fn(c, next);
        } catch (error: any) {
            return c.json({ error: error.message }, error.status ?? 500);
        }
    };
};

export const use = (fn: (c: Context) => any) => {
    return (c: Context) => {
        try {
            return fn(c);
        } catch (error: any) {
            return c.json({ error: error.message }, error.status ?? 500);
        }
    }
}
