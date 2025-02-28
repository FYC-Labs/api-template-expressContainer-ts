resource "aws_security_group" "api_gateway_sg" {
  vpc_id = aws_vpc.project_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "api_gateway_sg"
  }
}

resource "aws_apigatewayv2_vpc_link" "vpc_link" {
  name        = "${var.project_name}-vpc-link"
  security_group_ids = [aws_security_group.api_gateway_sg.id]
  subnet_ids  = [aws_subnet.project_subnet_1.id, aws_subnet.project_subnet_2.id]
}

resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "${var.project_name}-api"
  description = "REST API with VPC Link integration"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
  
}
EOF
}

resource "aws_lambda_function" "lambda_authorizer" {
  function_name = "${var.project_name}-authorizer"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  filename      = ""
  role          = aws_iam_role.lambda_role.arn
}


resource "aws_apigatewayv2_authorizer" "lambda_authorizer" {
  api_id          = aws_api_gateway_rest_api.rest_api.id
  name            = "lambda_authorizer"
  authorizer_type = "REQUEST"
  authorizer_uri  = aws_lambda_function.lambda_authorizer.invoke_arn
  identity_sources = ["$request.header.Authorization"]
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
  authorizer_id = aws_apigatewayv2_authorizer.lambda_authorizer.id
}

resource "aws_api_gateway_integration" "vpc_link_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.proxy_resource.id
  http_method             = aws_api_gateway_method.proxy_method.http_method
  type                    = "HTTP_PROXY"
  integration_http_method  = "ANY"
  connection_type         = "VPC_LINK"
  connection_id           = aws_apigatewayv2_vpc_link.vpc_link.id
  uri                     = "http://${aws_lb.nlb.dns_name}"
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  depends_on  = [aws_api_gateway_integration.vpc_link_integration]
}

resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "prod"
}
