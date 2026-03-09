import { NotFoundError } from '../utils/errors.js'

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getProfile(userId) {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }
}
