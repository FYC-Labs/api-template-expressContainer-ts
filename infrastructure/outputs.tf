output "vpc_id" {
    value = aws_vpc.project_vpc.id
}
output "gateway_id" {
    value = aws_internet_gateway.gw.id
  
}