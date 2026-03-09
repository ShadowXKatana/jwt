import { createContainer, asClass, asValue, InjectionMode } from 'awilix'
import prisma from './config/database.js'

// Import Repositories
import { UserRepository } from './repositories/user.repository.js'

// Import Services
import { UserService } from './services/user.service.js'

// Import Controllers
import { UserController } from './controllers/user.controller.js'

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC // Uses constructor parameter names to resolve dependencies
})

// Register all dependencies
container.register({
    // Value: Database connection
    prisma: asValue(prisma),

    // Classes: Repositories
    userRepository: asClass(UserRepository).singleton(),

    // Classes: Services
    userService: asClass(UserService).singleton(),

    // Classes: Controllers
    userController: asClass(UserController).singleton()
})

export default container
