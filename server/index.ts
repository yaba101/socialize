
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ZodError, z } from 'zod'
import * as fs from 'fs/promises'



const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
})

type User = z.infer<typeof userSchema>

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body
    const users = JSON.parse(await fs.readFile('users.json', 'utf-8'))
    const userArray = userSchema.array()
    userArray.parse(users)
    const matchingUser = users.find(
        (user: User) => user.username === username && user.password === password
    )
    if (matchingUser) {
        res.send({
            success: true,
            message: `Logged in as ${matchingUser.username}`,
            user: matchingUser,
        })
    } else {
        res.status(401).send({
            success: false,
            message: 'Invalid username or password',
        })
    }
})

app.post('/signup', async (req: Request, res: Response) => {
    const { username, password, email } = req.body

    try {
        const validatedUser = userSchema.parse({ username, password, email })
        const users = JSON.parse(await fs.readFile('users.json', 'utf-8'))
        if (users.some((user: User) => user.username === username)) {
            res.status(409).send({
                success: false,
                message: 'Username is already taken',
            })
        } else {
            users.push(validatedUser)
            await fs.writeFile('users.json', JSON.stringify(users))
            res.send({
                success: true,
                message: 'User created',
                user: validatedUser,
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).send({
                success: false,
                message: error.message,
            })
        }
    }
})

app.listen(5000, () => {
    console.log('Server started on port 3000')
})