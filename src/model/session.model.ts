import { Document, model, Schema } from "mongoose";

interface Session extends Document {
    sessionId: String
    ws: String
}

const sessionSchema = new Schema<Session>({
    sessionId: { type: String },
    ws: { type: String },
}, { timestamps: true })

const Session = model<Session>('Session', sessionSchema)
export default Session