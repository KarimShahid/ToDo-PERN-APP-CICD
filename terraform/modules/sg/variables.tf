variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod-sonarqube"
}

variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
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

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default = {
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}