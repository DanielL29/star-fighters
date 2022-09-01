import { NextFunction, Response } from 'express'

export default function errorsHandler(err: any, _: any, res: Response, next: NextFunction) {
    console.log(err)

    if(err.type === 'error_user_not_found') {
        return res.status(404).send(err.message)
    }

    res.status(500).send(err)
}