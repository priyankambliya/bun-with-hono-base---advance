import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { StatusCode } from "hono/utils/http-status";
import { JwtTokenExpired, JwtTokenNotBefore } from "hono/utils/jwt/types";
import User from "../model/user.model";
import { appStatusCodes } from "../utils/common/appStatusCodes";
import { appString } from "../utils/common/appString";
import encDec from "../utils/enc-dec";
import { throwError } from "../utils/errorHandler";

export const ROLE_MAP: { [key: string]: number } = {
    admin: 1,
    user: 2,
};

export const jwtAuth = (roles: string[]) => async (c: Context, next: Next): Promise<void> => {

    const authHeader: undefined | string = c.req.header("Authorization");
    if (!authHeader) {
        return throwError(appString.AUTH_TOKEN_MISSING, appStatusCodes.UNAUTHORIZED as StatusCode)
    }

    const token = authHeader.split(" ")[1]
    let decodedToken: any

    try {
        let decryptedTokenData: string = encDec.decryptPayload(token as string, process.env.ENCRYPTION_SECRET_KEY as string)
        let tokenData: unknown = await verify(JSON.parse(decryptedTokenData).toString(), process.env.JWT_SECRET as string)
        decodedToken = tokenData
    } catch (error: any) {
        if (error instanceof JwtTokenNotBefore || error instanceof JwtTokenExpired) {
            return throwError(appString.TOKEN_EXPIRED, appStatusCodes.UNAUTHORIZED as StatusCode)
        } else {
            throwError(appString.INVALID_ACCESS_TOKEN, appStatusCodes.UNAUTHORIZED as StatusCode)
        }
    }

    if (!decodedToken) {
        return throwError(appString.AUTH_TOKEN_MISSING, appStatusCodes.UNAUTHORIZED as StatusCode)
    }
    const user: User = await User.findOne({ _id: decodedToken.user._id }).lean().select('-password -updatedAt -__v')

    if (!user) {
        return throwError(appString.USER_NOT_FOUND, appStatusCodes.UNAUTHORIZED as StatusCode)
    }

    const requiredRoles = roles.map(role => ROLE_MAP[role.toLowerCase()]);
    let userRole = user.role

    if (requiredRoles.length && !requiredRoles.includes(userRole as number)) {
        return throwError(appString.UNAUTHORIZED_API, appStatusCodes.LOCKED as StatusCode);
    }

    c.set('user', user)
    await next()
}