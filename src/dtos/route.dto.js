export class RouteDto {
    constructor(description, params, authRequired, headers = undefined) {
        this.description = description
        this.params = params
        this.auth_required = authRequired
        if (headers) {
            this.headers = headers
        }
    }
}

export class HelpResponseDto {
    constructor() {
        this.message = 'Available API Routes'
        this.routes = {
            'GET /api': new RouteDto('Health check route to verify the server is running.', 'None', false),
            'GET /api/help': new RouteDto('This help endpoint detailing all available routes.', 'None', false),
            'POST /api/auth/sign-up': new RouteDto('Register a new user via Better Auth.', {
                email: 'string (required)',
                password: 'string (required)',
                name: 'string (required)'
            }, false),
            'POST /api/auth/sign-in': new RouteDto('Log in an existing user via Better Auth.', {
                email: 'string (required)',
                password: 'string (required)'
            }, false),
            'GET /api/user/profile': new RouteDto('Fetch custom profile data from the database.', 'None', true, 'Authorization: Bearer <token>')
        }
    }
}
