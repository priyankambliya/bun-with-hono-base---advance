import { Context, Next } from 'hono';

export type StageName = 'development' | 'production' | 'staging';

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

export const stageDetector = (stageName: StageName): void => {
    switch (stageName) {
        case 'development':
            console.log("-------------------------- YUP, Devs let's start developing 😎😎 --------------------------");
            break
        case 'production':
            console.log('Running in production mode');
            break
        case 'staging':
            console.log('Running in staging mode');
            break
        default:
            break
    }
};
