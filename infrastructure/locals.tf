locals {
    secret_data = {
        DATABASE_URL                           = "postgres://postgres:postgres@localhost:5432/postgres"
        APP_PORT                               = "3001"
    }  
}