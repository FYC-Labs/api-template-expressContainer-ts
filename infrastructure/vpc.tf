resource "aws_vpc" "project_vpc" {
  cidr_block = "10.0.0.0/16"
    enable_dns_support = true
    enable_dns_hostnames = true
  
}

 resource "aws_internet_gateway" "gw" {
    vpc_id = aws_vpc.project_vpc.id

    tags = {
        Name = "${var.project_name}-igw"
    }
}

# Private subnets
# Note: Need to update name to ${var.project_name}-private-subnet-1

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

# Public subnet
# Note: Need to update name to ${var.project_name}-public-subnet-1

resource "aws_subnet" "public_subnet_1" {
    vpc_id            = aws_vpc.project_vpc.id
    cidr_block        = "10.0.3.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = true
  
}

resource "aws_route_table" "public_route_table" {
    vpc_id = aws_vpc.project_vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.gw.id
    }
}

resource "aws_route_table_association" "public_association_1" {
    subnet_id      = aws_subnet.public_subnet_1.id
    route_table_id = aws_route_table.public_route_table.id

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
