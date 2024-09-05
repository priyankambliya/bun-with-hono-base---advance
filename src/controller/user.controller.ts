import { Context } from "hono";
import { ROLE_MAP } from "../middleware/auth.middleware";

const roleNames: { [key: number]: string } = Object.fromEntries(
    Object.entries(ROLE_MAP).map(([key, value]) => [value, key])
);

function getProfile(c: Context) {
    const user = c.get('user');
    let role = roleNames[user.role];
    delete user.isDeleted
    return c.json({ data: { ...user, role } });
}

export default { getProfile }