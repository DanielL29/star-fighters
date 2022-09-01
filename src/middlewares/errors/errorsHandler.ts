import { NextFunction, Response } from 'express'

export default function errorsHandler(err: any, _: any, res: Response, next: NextFunction) {
    console.log(err)

    if(err.code === 'ERR_BAD_REQUEST') {
        return res.status(404).send(err.message)
    }

    res.status(500).send(err)
}