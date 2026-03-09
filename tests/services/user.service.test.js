import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../../src/services/user.service.js'

describe('UserService', () => {
    let userService
    let mockUserRepository

    beforeEach(() => {
        // Mock the UserRepository
        mockUserRepository = {
            findById: vi.fn(),
            create: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn()
        }

        // Inject the mock repository into the service
        userService = new UserService(mockUserRepository)
    })

    describe('getProfile', () => {
        it('should return a user when a valid ID is provided', async () => {
            // Arrange
            const mockUser = {
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                emailVerified: true
            }
            mockUserRepository.findById.mockResolvedValue(mockUser)

            // Act
            const result = await userService.getProfile('123')

            // Assert
            expect(result).toEqual(mockUser)
            expect(mockUserRepository.findById).toHaveBeenCalledWith('123')
            expect(mockUserRepository.findById).toHaveBeenCalledTimes(1)
        })

        it('should throw an error when user is not found', async () => {
            // Arrange
            mockUserRepository.findById.mockResolvedValue(null)

            // Act & Assert
            await expect(userService.getProfile('non-existent-id')).rejects.toThrow('User not found')
            expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent-id')
        })
    })

    // We can confidently test logic without needing a real database connection!
})
