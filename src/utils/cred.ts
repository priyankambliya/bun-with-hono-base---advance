import readline from 'readline'
import database from "../database"
import { throwError } from "./errorHandler"
import { appStatusCodes } from "./common/appStatusCodes"
import { StatusCode } from "hono/utils/http-status"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

let superAdminEmail: string = ''
let superAdminPassword: string = ''

export const superAuth = () => {
    rl.question('Enter Email: ', (email: string) => {
        superAdminEmail = email.toString()

        rl.question('Enter Password: ', (pass: string) => {
            superAdminPassword = pass.toString()
            if ((superAdminEmail === process.env.SUPER_ADMIN_EMAIL) && (superAdminPassword === process.env.SUPER_ADMIN_PASSWORD)) {
                console.log(`Website listening on port ${process.env.PORT}..`)
                database.then(() => console.log('mongodb Connection established..')).catch(e => console.log('mongodb connection Failed for some reason..'))
            } else {
                throwError('Invalid credential..', appStatusCodes.UNAUTHORIZED as StatusCode)
                rl.close()
            }
        })
    })
}