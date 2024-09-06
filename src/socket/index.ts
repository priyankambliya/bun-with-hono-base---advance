import { ServerWebSocket } from "bun";
import Session from "../model/session.model";
import encDec from "../utils/enc-dec";
import { CustomServerWebSocket } from "../server";

interface UserSession {
    ws: ServerWebSocket
    sessionId: number
}

interface CalculatorProps {
    method: string
    values: {
        first: number
        second: number
    }
}

let calculationMethodArray: string[] = ['addition', 'subtraction', 'divide', 'multiplication']

let sessions: UserSession[] = []

const getSessionId = () => {
    const date: any = new Date()
    const sessionId = Math.floor(date)
    return sessionId
}

export async function connectSocket(ws: CustomServerWebSocket) {
    const sessionId = getSessionId()
    const message = "well come to our site!!"
    const sessionMessage = `Your session id is ${sessionId}`
    ws.id = sessionId.toString()
    const stringifiedWs = encDec.encryptPayload(ws, "1234567891234568")
    const session = new Session({ ws: stringifiedWs.toString(), sessionId })
    await session.save()
    ws.sendText(message)
    ws.sendText(sessionMessage)
}

export async function closeSocket(ws: CustomServerWebSocket) {
    await Session.findOneAndDelete({ sessionId: ws.id.toString() })
}

export function customDataMessage(ws: CustomServerWebSocket, data: any) {
    const answer = calculation(JSON.parse(data))
    if (answer === 'inValid') return ws.sendText('sorry, i am just a calculation boat!!')
    ws.sendText(`Sir Your answer is : ${answer}`)
}

function calculation({ method, values }: CalculatorProps) {
    let answer = 0
    if (!calculationMethodArray.includes(method)) return 'inValid'
    switch (method) {
        case 'addition':
            console.log("comes here")
            answer = values.first + values.second
            break
        case 'subtraction':
            answer = values.first - values.second
            break
        case 'divide':
            answer = values.first / values.second
            break
        case 'multiplication':
            answer = values.first * values.second
            break
        default:
            break
    }

    return answer
}
