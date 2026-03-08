export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        })
    }

    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }

    async create(userData) {
        return this.prisma.user.create({
            data: userData,
        })
    }
}
