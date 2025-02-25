locals {
    secret_data = {
        TZ                                     = "UTC"
        CORS_ALLOWED_FROM                      = "http://localhost:3000"
        DATABASE_URL                           = "postgres://postgres:postgres@localhost:5432/postgres"
        REDIS_HOST                             = "localhost"
        REDIS_PORT                             = "6379"
        REDIS_USER                             = "redis"
        REDIS_PASS                             = "redis"
        REDIS_DB                               = "0"
        APP_PORT                               = "3001"
    }  
}