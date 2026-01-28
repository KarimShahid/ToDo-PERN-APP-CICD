# Environment
environment = "prod-CICD"

# AWS
aws_region = "us-east-1"

# VPC
vpc_cidr = "10.0.0.0/16"

ssh_allowed_cidr = "0.0.0.0/0"

# Common tags
tags = {
  Environment = "prod-sonarqube"
  ManagedBy   = "terraform"
}

to_port   = 5001
from_port = 5001
protocol  = "tcp"


key_name = "awsKeyPair"