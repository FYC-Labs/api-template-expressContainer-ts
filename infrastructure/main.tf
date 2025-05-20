 provider "aws" {
  region  = "us-east-1"
  profile = var.use_profile ? var.profile : null

  access_key = var.use_profile ? null : var.aws_access_key_id
  secret_key = var.use_profile ? null : var.aws_secret_access_key

  assume_role {
    role_arn     = var.use_profile ? null : var.role_arn
    session_name = "TerraformRoleSession"
  }
}
