variable "aws_region" {
  description = "The AWS region to deploy to"
  type = string
  default     = "us-east-1"
}

variable "aws_profile" {
  type = string
  description = "The AWS profile to use"
  default     = "default"
}


variable "aws_account_id" {
  type = string
  description = "The AWS account ID"
}

variable "aws_vpc_cidr" {
  type = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}


variable "aws_arn" {
  type = string
  description = "The ARN for the AWS account"
  validation {
    condition = length(var.aws_arn) > 0
    error_message = "The ARN must be provided"
  }
}

variable "project_name" {
  type = string
  description = "The name of the project"
  
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