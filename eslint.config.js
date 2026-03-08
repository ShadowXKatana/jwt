export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'never']
        }
    }
]
