import { Context } from "hono";
import { sign } from 'hono/jwt';
import { StatusCode } from "hono/utils/http-status";
import { JWTPayload } from "hono/utils/jwt/types";
import encDec from '.././utils/enc-dec';
import User from "../model/user.model";
import { appStatusCodes } from "../utils/common/appStatusCodes";
import { appString } from "../utils/common/appString";
import { isExist } from "../utils/common/functions";
import { throwError } from "../utils/errorHandler";
import { LoginRequestBody, RegisterRequestBody } from "../utils/interface/auth.interface";

const register = async (c: Context): Promise<Response> => {
    const { email, password, role } = await c.req.json<RegisterRequestBody>();
    const compressedPassword = await Bun.password.hash(password);
    const isUserExist = await isExist("User", { email, role })
    if (isUserExist) return throwError(appString.USER_ALREADY_EXIST(parseInt(role)), appStatusCodes.CONFLICT as StatusCode)
    const user = new User({ email, password: compressedPassword, role })
    await user.save()
    return c.json({ data: 'User Registered Successfully' })
}

const login = async (c: Context): Promise<Response> => {
    const { email, password, role } = await c.req.json<LoginRequestBody>();
    const user: User = await User.findOne({ email, role }).select('email createdAt role password')
    if (!user) return throwError(appString.USER_NOT_FOUND, appStatusCodes.NOT_FOUND as StatusCode)
    const securedPasswordMatch = await Bun.password.verify(password, user?.password as string)
    if (!securedPasswordMatch) return throwError(appString.USER_PASSWORD_MISS_MATCH, appStatusCodes.UNAUTHORIZED as StatusCode)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    const expireTime = parseInt(process.env.JWT_EXPIRES_IN as string) ?? 1800
    const payload = {
        user: userWithoutPassword,
        role: user?.role,
        exp: Math.floor(Date.now() / 1000) + expireTime,
    }
    const token = await sign(payload as JWTPayload, process.env.JWT_SECRET as string)
    const encryptedTokenData = encDec.encryptPayload(JSON.stringify(token), process.env.ENCRYPTION_SECRET_KEY as string)
    return c.json({ data: { token: encryptedTokenData } })
}

export default { login, register }