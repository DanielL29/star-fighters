import { Request, Response } from 'express'
import { battleService, rankingService } from '../services/fighterService.js'

async function battle(req: Request, res: Response) {
    const { firstUser, secondUser } = req.body
    
    const result = await battleService(firstUser, secondUser)

    res.status(200).send(result)
}

async function ranking(_: any, res: Response) {
    const ranking = await rankingService()

    res.status(200).send({ fighters: ranking })
}

export { battle, ranking }