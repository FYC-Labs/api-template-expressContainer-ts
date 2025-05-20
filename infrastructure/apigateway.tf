resource "aws_api_gateway_vpc_link" "vpc_link" {
  name        = "${var.project_name}-vpc-link"
  target_arns = [aws_lb.nlb.arn]
  description = "VPC Link to NLB"

  tags = {
    Name = "${var.project_name}-vpc-link"
  }
}

resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "${var.project_name}-api"
  description = "REST API with VPC Link integration"

  tags = {
    Name = "${var.project_name}-api"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-lambda-role"
  }
}

resource "aws_lambda_function" "lambda_authorizer" {
  function_name = "${var.project_name}-authorizer"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "../functions/lambda-authorizer/authorizer.zip"
  role          = aws_iam_role.lambda_role.arn

  tags = {
    Name = "${var.project_name}-authorizer"
  }
}

resource "aws_api_gateway_authorizer" "lambda_authorizer" {
  rest_api_id           = aws_api_gateway_rest_api.rest_api.id
  name                  = "${var.project_name}-authorizer"
  authorizer_uri        = aws_lambda_function.lambda_authorizer.invoke_arn
  authorizer_credentials = aws_iam_role.lambda_role.arn
  type                  = "REQUEST"
}

resource "aws_lambda_permission" "authorizer_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "ANY"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.lambda_authorizer.id
}

resource "aws_api_gateway_integration" "vpc_link_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.proxy_resource.id
  http_method             = aws_api_gateway_method.proxy_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "ANY"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.vpc_link.id
  timeout_milliseconds    = 29000
}

resource "aws_api_gateway_method_response" "proxy_method_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.proxy_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_integration_response" "proxy_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.proxy_method.http_method
  status_code = aws_api_gateway_method_response.proxy_method_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  depends_on  = [
    aws_api_gateway_integration.vpc_link_integration,
    aws_api_gateway_integration_response.proxy_integration_response
  ]

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy_resource.id,
      aws_api_gateway_method.proxy_method.id,
      aws_api_gateway_integration.vpc_link_integration.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "prod"

  tags = {
    Name = "${var.project_name}-api-stage"
  }
}
