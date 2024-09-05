import { z } from 'zod'

export const registerValidationSchema = z.object({
    email: z
        .string({ required_error: "Email is Required" })
        .email("Invalid email address")
        .min(1, "Email is Required"),

    password: z
        .string({ required_error: "Password is Required" })
        .min(6, "Password must be at least 6 characters long")
        .max(16, "Password length is under 16 characters"),

    role: z
        .number({ required_error: "Role is required", invalid_type_error: "Role must be a number" })
})
