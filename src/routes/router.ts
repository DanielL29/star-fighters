import { Router } from 'express'
import fighterRouter from './fighterRouter.js'

const router = Router()

router.use(fighterRouter)

export default router