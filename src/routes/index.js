import { Router } from 'express'
import { HelpResponseDto } from '../dtos/route.dto.js'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' })
})

router.get('/help', (req, res) => {
    const responseDto = new HelpResponseDto()
    res.status(200).json(responseDto)
})

export default router