import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async register(email, password, name) {
        const existingUser = await this.userRepository.findByEmail(email)
        if (existingUser) {
            throw new Error('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            name,
        })

        return { id: user.id, email: user.email, name: user.name }
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Invalid email or password')
        }

        const payload = { userId: user.id, email: user.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '1h',
        })

        return { token, user: { id: user.id, email: user.email, name: user.name } }
    }

    async getProfile(userId) {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        return { id: user.id, email: user.email, name: user.name }
    }
}
