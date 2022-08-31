import { Router } from 'express'
import { battle } from '../controllers/fighterController.js'
import validateSchemas from '../middlewares/validations/validateSchemas.js'

const fighterRouter = Router()

fighterRouter.post('/battle', validateSchemas('battle'), battle)

export default fighterRouter