export class UserDto {
    constructor(user) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.emailVerified = user.emailVerified
        this.image = user.image
        this.createdAt = user.createdAt
        this.updatedAt = user.updatedAt
    }

    /**
     * Factory method to properly handle null/undefined entities
     */
    static fromEntity(user) {
        if (!user) return null
        return new UserDto(user)
    }

    /**
     * Factory method for mapping an array of entities
     */
    static fromList(users) {
        if (!Array.isArray(users)) return []
        return users.map(user => this.fromEntity(user))
    }
}
