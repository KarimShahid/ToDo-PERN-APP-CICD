variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  # default     = "prod-CICD-Server"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default = {
    ManagedBy = "terraform"
  }
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into EC2"
  type        = string
}

variable "from_port" {
  description = "The starting port for the security group rule"
  type        = number
  default     = 22
}

variable "to_port" {
  description = "The ending port for the security group rule"
  type        = number
  default     = 22
}

variable "protocol" {
  description = "The protocol for the security group rule. Must be one of: tcp, udp, icmp"
  type        = string
  default     = "tcp"

  validation {
    condition     = contains(["tcp", "udp", "icmp"], var.protocol)
    error_message = "Invalid protocol. Allowed values are: tcp, udp, icmp."
  }
}


variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "user_data" {
  description = "User data script to run on instance launch"
  type        = string
  default     = ""
}