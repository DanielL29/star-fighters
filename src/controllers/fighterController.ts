import { Request, Response } from 'express'
import { battleService } from '../services/fighterService.js'

async function battle(req: Request, res: Response) {
    const { firstUser, secondUser } = req.body
    
    const result = await battleService(firstUser, secondUser)

    res.status(200).send(result)
}

export { battle }