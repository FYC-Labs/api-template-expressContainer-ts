# Codebase Structure

.husky: git hooks (please do not edit without using Husky CLI)
.vscode: vscode configuration
src/_\_tests__: integration tests
src/@types: global type definitions
src/config: configuration files
src/routes: contains routes
src/services/<< name >>: service files
src/system: contains the high level of the app
src/system/container: contains the providers to dependency injection
src/system/providers/<< name >>: provider root folder
src/system/providers/<< name >>/implementations: provider implementation
src/system/providers/<< name >>/mocks: fake provider for testing purposes
src/system/providers/<< name >>/mocks: provider interfaces and entities
src/system/errors: controlled/forced exceptions
src/system/i18n: i18n configuration and translation packages
src/system/infra/http: contains the app starter, brain of application
src/system/infra/http/middlewares: global middlewares
src/system/infra/http/routes: global router which joins all modules into once
src/system/util: utility functions
