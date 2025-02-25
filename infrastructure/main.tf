terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = "us-east-1"
    # shared_config_files = ["~/.aws/config", "~/.aws/credentials"]
    assume_role {
        role_arn = "arn:aws:iam::${var.aws_arn}:role/terraform"
    }
}

resource "aws_vpc" "project_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "project_subnet_1" {
  vpc_id            = aws_vpc.project_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

    tags = {
        Name = "project_subnet_main"
    }
}

resource  "aws_subnet" "project_subnet_2" {
  vpc_id            = aws_vpc.project_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"

    tags = {
        Name = "project_subnet_secondary"
    }
}

resource "aws_security_group" "deny_all_incoming" {
    vpc_id = aws_vpc.project_vpc.id

    ingress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        description = "Deny all incoming traffic"
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        description = "Allow all outgoing traffic"
    }

    tags = {
        Name = "deny_all_incoming"
    }
}
