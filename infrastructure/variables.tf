# AWS Provider Configuration
variable "aws_region" {
  description = "The default AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "use_profile" {
  type        = bool
  description = "Whether to use an AWS profile or access keys"
  default     = false
}

variable "profile" {
  type = string
  description = "The AWS profile to use"
  default     = ""
}

variable "aws_access_key_id" {
  type        = string
  description = "The AWS access key"
  sensitive   = true
}

variable "aws_secret_access_key" {
  type        = string
  description = "The AWS secret access key"
  sensitive   = true
}

variable "role_arn" {
  type        = string
  description = "The ARN of the role to assume"
  default     = ""
}

variable "project_name" {
  type        = string
  description = "The name of the project"
  validation {
    condition     = length(var.project_name) > 0 && can(regex("^[a-z]+$", var.project_name))
    error_message = "Project name must be lowercase letters only and not empty"
  }
}

variable "environment" {
  type        = string
  description = "The environment to deploy to (dev, staging, prod)"
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod"
  }
}

# Network Configuration
variable "aws_vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrhost(var.aws_vpc_cidr, 0))
    error_message = "Must be a valid CIDR block"
  }
}

# ECS Configuration
variable "ecs_task_cpu" {
  type        = string
  description = "CPU units for the ECS task (1024 = 1 vCPU)"
  default     = "512"
  validation {
    condition     = contains(["256", "512", "1024", "2048", "4096"], var.ecs_task_cpu)
    error_message = "CPU must be one of: 256, 512, 1024, 2048, 4096"
  }
}

variable "ecs_task_memory" {
  type        = string
  description = "Memory for the ECS task in MiB"
  default     = "1024"
  validation {
    condition     = contains(["512", "1024", "2048", "4096", "8192"], var.ecs_task_memory)
    error_message = "Memory must be one of: 512, 1024, 2048, 4096, 8192"
  }
}

variable "ecs_desired_count" {
  type        = number
  description = "Number of ECS tasks to run"
  default     = 2
  validation {
    condition     = var.ecs_desired_count > 0
    error_message = "Desired count must be greater than 0"
  }
}

# Database Configuration
variable "db_instance_class" {
  type        = string
  description = "RDS instance class"
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  type        = number
  description = "Allocated storage for RDS in GB"
  default     = 20
  validation {
    condition     = var.db_allocated_storage >= 20
    error_message = "Allocated storage must be at least 20GB"
  }
}

variable "db_engine_version" {
  type        = string
  description = "PostgreSQL engine version"
  default     = "15"
}

# Secrets
variable "secrets_config" {
  type        = string
  description = "The name of the secrets config in Secrets Manager"
  default     = "config"
}

# API Gateway
variable "api_gateway_timeout" {
  type        = number
  description = "API Gateway integration timeout in milliseconds"
  default     = 29000
  validation {
    condition     = var.api_gateway_timeout >= 0 && var.api_gateway_timeout <= 29000
    error_message = "Timeout must be between 0 and 29000 milliseconds"
  }
}