import { Next } from "hono";
import { Schema, Document, model } from "mongoose"
import { throwError } from "../utils/errorHandler";
import { appStatusCodes } from "../utils/common/appStatusCodes";
import { StatusCode } from "hono/utils/http-status";

interface User extends Document {
    name: String;
    email: String;
    password: String;
    role: Number;
    isDeleted: Number;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: Number, enum: [0, 1, 2], default: 2, comment: "0 => super admin 1 => admin 2 => user" },
    isDeleted: { type: Number, enum: [0, 1], default: 0, comment: "1 => true 0 => false" }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_, user) => {
            delete user.id
            return user
        }
    },
    toObject: {
        virtuals: true,
        transform: (_, user) => {
            delete user.id
            return user
        }
    }
})

const User = model<User>('User', userSchema)
export default User