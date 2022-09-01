import { Router } from 'express'
import { battle, ranking } from '../controllers/fighterController.js'
import validateSchemas from '../middlewares/validations/validateSchemas.js'

const fighterRouter = Router()

fighterRouter.post('/battle', validateSchemas('battle'), battle)
fighterRouter.get('/ranking', ranking)

export default fighterRouter