variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod-Server"
}


variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default = {
    Environment = "prod-server"
    ManagedBy   = "terraform"
  }
}


variable "subnet_id" {
  description = "Subnet ID where EC2 instance will be launched"
  type        = string
}


variable "sg_id" {
  type = string
  description = "Security Group ID where the web server will be deployed"
}

variable "key_name" {
  type        = string
  description = "EC2 key pair name"
}

variable "user_data" {
  description = "User data script to run on instance launch"
  type        = string
  default     = ""
}