import { UserDto } from '../dtos/user.dto.js'
import { catchAsync } from '../utils/catchAsync.js'
import { NotFoundError } from '../utils/errors.js'

export class UserController {
    constructor(userService) {
        this.userService = userService

        // Bind the method to the class instance to maintain `this` context when passed to Express router
        this.profileHandler = catchAsync(this.profileHandler.bind(this))
    }

    async profileHandler(req, res) {
        // req.user is attached by the authMiddleware from Better Auth session
        const userId = req.user.id

        const user = await this.userService.getProfile(userId)

        if (!user) {
            throw new NotFoundError('User not found')
        }

        // Map the DB model to a DTO
        const userDto = UserDto.fromEntity(user)
        res.status(200).json({ user: userDto })
    }
}
