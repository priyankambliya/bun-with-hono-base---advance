export const appString = {
    // User Messages
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXIST(role: number) {
        return `This ${role === 1 ? 'Admin' : 'User'} already Exist please do login`
    },
    USER_LOGIN: 'User Login',
    USER_PROFILE: 'User Profile',
    USER_REGISTER: 'User Register',
    USER_UPDATED: 'User Updated',
    USER_DELETED: 'User Deleted',
    USER_PASSWORD_MISS_MATCH: 'User Password miss match',

    // Auth Messages
    AUTH_TOKEN_MISSING: 'Auth token is missing',
    INVALID_ACCESS_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: "Token Time Expired",
    UNAUTHORIZED_API: "You are not authorized to access this API",
}