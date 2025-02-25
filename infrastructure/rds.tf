resource "aws_security_group" "rds_connections" {
  vpc_id = aws_vpc.project_vpc.id
  name = "rds_connections"
  description = "Security group for RDS connections"
  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "tcp"
    cidr_blocks = ["IP_ADDRESS/32"] # Replace with your IP address
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
}

  tags = {
    Name = "rds_connections"
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name = "rds_subnet_group"
  subnet_ids = [aws_subnet.project_subnet_1.id, aws_subnet.project_subnet_2.id]
  tags = {
    Name = "rds_subnet_group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "postgres"
  engine = "postgres"
  engine_version = "15"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  storage_type = "gp2"
  publicly_accessible = true
  db_name = "project-db"
  username = "admin"
  manage_master_user_password = "true"
  vpc_security_group_ids = [aws_security_group.rds_connections.id]
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
}