import app from "./app"
import { closeSocket, connectSocket, customDataMessage } from "./socket"
import { ServerWebSocket } from "bun";

export interface CustomServerWebSocket extends ServerWebSocket<undefined> {
    id: string;
}

Bun.serve({
    port: process.env.PORT,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return
        }
        return app.fetch(req, server)
    },
    websocket: {
        open(ws: CustomServerWebSocket) { connectSocket(ws) },
        message(ws: CustomServerWebSocket, data: any) { customDataMessage(ws, data) },
        close(ws: CustomServerWebSocket) { closeSocket(ws) },
    }
})
