terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# This creates the S3 bucket for Terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "todoapp-remote-backend-2026" 
  
  tags = {
    Environment = "infrastructure"
    ManagedBy   = "terraform"
  }
}

# Enable versioning
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.terraform_state.id
  description = "The name of the S3 bucket for Terraform state"
}

output "next_steps" {
  value = <<-EOT
    ✅ S3 backend bucket created!
    
    Next: Update backend.tf with this bucket name:
    
    terraform {
      backend "s3" {
        bucket  = "${aws_s3_bucket.terraform_state.id}"
        key     = "todoapp-CICD/terraform.tfstate"
        region  = "us-east-1"
        encrypt = true
      }
    }
  EOT
}