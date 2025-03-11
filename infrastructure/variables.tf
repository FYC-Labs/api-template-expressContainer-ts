variable "aws_region" {
  description = "The default AWS region to deploy to"
  type = string
  default     = "us-east-1"
}

variable "aws_vpc_cidr" {
  type = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "use_profile" {
  type = bool
  description = "Whether to use an AWS profile or access keys"
  default     = false
}

variable "profile" {
  type = string
  description = "The AWS profile to use"
  default     = ""
}

variable "aws_access_key_id" {
  type = string
  description = "The AWS access key"
}

variable "aws_secret_access_key" {
  type = string
  description = "The AWS secret access key"
}

variable "role_arn" {
  type = string
  description = "The ARN of the role to assume"
  default = ""
}

variable "project_name" {
  type = string
  description = "The name of the project"
  validation {
    condition = length(var.project_name) > 0 && can(regex("^[a-z]+$", var.project_name))
    error_message = "Project name must not be empty"
  }
}

variable "environment" {
  type = string
  description = "The environment to deploy to"
  default     = "dev"
}

variable "secrets_config" {
  type = string
  description = "The name of the secrets config in Secrets Manager"
  default     = "config"
}