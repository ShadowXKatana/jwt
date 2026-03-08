export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getProfile(userId) {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        return user
    }
}
